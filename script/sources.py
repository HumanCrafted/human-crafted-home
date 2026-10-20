#!/usr/bin/env python3
"""Write _data/sources.yml (the /sources/ page) from the CoOps supply notes.

CoOps is the record; this copies across only what the site shows. A supply note
(CoOps supplies/*.md, `type: supply`) is listed once it carries `site: true`.
From its "On hand" table each row gives the item (first column), Part, Vendor
and the URL in Link. Prices, counts and pack sizes are never copied. A row with
no vendor yet, or whose item is a placeholder, is skipped; a placeholder Part or
Link is just left off.

A supply's `site_image:` property is the photo for its thumbnail: a vendor image
URL (downloaded once into ~/.cache/hc-sources/) or a file path relative to the
CoOps supplies/ folder. The script trims it to the subject, squares it, and tones
it from the page's ink to its paper color, so the vendor's white background melts
into the page. An "Image" column in the On hand table does the same per row (the
cello bags have one photo per size), and a "Spec" column is added to the row's
item text. Thumbnails go to assets/images/sources/ (<slug>.jpg, or
<slug>-<item>.jpg per row; ones nothing uses any more are deleted) and need
Pillow, so run it with the swatches venv:

    ~/.venvs/swatches/bin/python script/sources.py   # write _data/sources.yml + thumbnails
    python3 script/sources.py --check                # report whether the data is out of date

COOPS overrides where the CoOps vault is (defaults to the iCloud path).
"""
import hashlib
import io
import json
import os
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

SITE = Path(__file__).resolve().parent.parent
COOPS = Path(os.environ.get("COOPS", Path.home() / "Library/Mobile Documents/iCloud~md~obsidian/Documents/CoOps"))
OUT = SITE / "_data/sources.yml"
THUMBS = SITE / "assets/images/sources"
CACHE = Path.home() / ".cache/hc-sources"
THUMB_PX = 128                      # shown at 64px; 2x for retina screens
INK, PAPER = "#2A2824", "#FAF7F2"   # light-mode --foreground / --background in main.css


def front_matter(text):
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not m:
        return {}
    out = {}
    for line in m.group(1).splitlines():
        k = re.match(r"([\w-]+):\s*(.*)$", line)
        if k:
            v = k.group(2).strip().strip('"')
            out[k.group(1)] = {"true": True, "false": False}.get(v, v)
    return out


def tables(text):
    """{heading: [row dicts]} for every markdown table, keyed by the heading above it."""
    raw, heading = {}, None
    for line in (l.strip() for l in text.splitlines()):
        h = re.match(r"#{2,6}\s+(.*)$", line)
        if h:
            heading = h.group(1).strip()
            continue
        if not heading or not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if all(c == "" or re.fullmatch(r":?-{2,}:?", c) for c in cells):
            continue
        raw.setdefault(heading, []).append(cells)
    return {k: [dict(zip(hdr, r + [""] * len(hdr))) for r in body] for k, (hdr, *body) in raw.items()}


def filled(v):
    return bool(v) and "placeholder" not in v


TRACKING = re.compile(r"^(ref|gclid|gclsrc|gbraid|wbraid|gad_\w+|utm_\w+|store)$")


def link_url(cell):
    """The URL in a Link cell, minus tracking parameters (Amazon's ?ref=, ad click ids)."""
    m = re.search(r"\((https?://[^)\s]+)\)", cell) or re.search(r"https?://\S+", cell)
    if not m:
        return None
    url = m.group(1) if m.groups() else m.group(0)
    parts = urlsplit(url)
    query = urlencode([(k, v) for k, v in parse_qsl(parts.query) if not TRACKING.match(k)])
    return urlunsplit(parts._replace(query=query))


def notes(folder, kind):
    for path in sorted((COOPS / folder).glob("*.md")):
        text = path.read_text()
        fm = front_matter(text)
        if fm.get("type") == kind:
            yield fm.get("slug") or path.stem, fm, tables(text)


def source_photo(slug, src):
    """Local path to a supply's photo: a file in CoOps supplies/, or a URL fetched once into CACHE."""
    if not re.match(r"https?://", src):
        return COOPS / "supplies" / src
    path = CACHE / f"{slug}-{hashlib.sha1(src.encode()).hexdigest()[:8]}"
    if not path.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(src, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            path.write_bytes(r.read())
    return path


def thumbnail(photo):
    """JPEG bytes: the photo trimmed to its subject, squared on white, toned ink to paper."""
    from PIL import Image, ImageOps
    im = Image.open(photo)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, "white")
        bg.alpha_composite(im)
        im = bg
    g = ImageOps.grayscale(im.convert("RGB"))
    g = g.crop(g.point(lambda v: 255 if v < 235 else 0).getbbox() or (0, 0, *g.size))
    side = int(max(g.size) * 1.12)  # a little air around the subject
    sq = Image.new("L", (side, side), 255)
    sq.paste(g, ((side - g.width) // 2, (side - g.height) // 2))
    sq = sq.resize((THUMB_PX, THUMB_PX), Image.LANCZOS)
    # Pull the darks part of the way to black. A full autocontrast turns a pale
    # subject (a clear cello bag on white) into a dark block.
    hist, n, lo = sq.histogram(), 0, 0
    while lo < 254 and n + hist[lo] < THUMB_PX * THUMB_PX * 0.01:
        n += hist[lo]
        lo += 1
    target = lo * 0.4
    sq = sq.point(lambda v: 255 if v >= 255 else max(0, round(target + (v - lo) * (255 - target) / (255 - lo))))
    buf = io.BytesIO()
    ImageOps.colorize(sq, black=INK, white=PAPER).save(buf, "JPEG", quality=85, optimize=True)
    return buf.getvalue()


def build():
    sources, skipped = [], []
    for slug, fm, T in notes("supplies", "supply"):
        if fm.get("site") is not True:
            continue
        rows = T.get("On hand", [])
        items = []
        for r in rows:
            item = next(iter(r.values()), "")
            if not filled(item) or not filled(r.get("Vendor")):
                skipped.append(f"{slug}: {item or '(blank row)'} (no vendor yet)" if filled(item) else f"{slug}: {item or '(blank row)'}")
                continue
            # A Spec column adds to the item ("2x3, 2 mil clear OPP, self-adhesive
            # flap"); its placeholder parts are left off, not the whole row.
            spec = [p.strip() for p in r.get("Spec", "").split(",") if filled(p.strip())]
            entry = {"item": ", ".join([item] + spec)}
            if filled(r.get("Part")):
                entry["part"] = r["Part"]
            entry["vendor"] = r["Vendor"]
            url = link_url(r.get("Link", ""))
            if url:
                entry["url"] = url
            # An Image column gives a row its own thumbnail (one per bag size).
            image = r.get("Image", "")
            m = re.search(r"\(([^)\s]+)\)", image)
            image = m.group(1) if m else image
            if filled(image):
                entry["image_src"] = image
                entry["thumb"] = f"{slug}-{re.sub(r'[^a-z0-9]+', '-', item.lower()).strip('-')}"
            items.append(entry)
        if not items:
            skipped.append(f"{slug}: nothing to show, left off the page")
            continue
        sources.append({
            "name": fm.get("supply") or slug,
            "slug": slug,
            "items": items,
            "image_src": fm.get("site_image") if filled(fm.get("site_image")) else None,
        })
    sources.sort(key=lambda s: s["name"].lower())
    return sources, skipped


def to_yaml(sources):
    q = json.dumps  # a JSON string is a valid YAML double-quoted scalar
    lines = [
        "# GENERATED by script/sources.py from the CoOps supply notes — don't edit here.",
        "# Change the CoOps note (supplies/<slug>.md) and run the script again.",
        "# Rendered by _docs/sources.md (/sources/).",
        "",
    ]
    for s in sources:
        lines += [f"- name: {q(s['name'])}", f"  slug: {q(s['slug'])}"]
        if s.get("image"):
            lines.append(f"  image: {q(s['image'])}")
        lines.append("  items:")
        for it in s["items"]:
            keys = list(it)
            lines.append(f"    - {keys[0]}: {q(it[keys[0]])}")
            lines += [f"      {k}: {q(it[k])}" for k in keys[1:]]
        lines.append("")
    return "\n".join(lines)


def main():
    if not (COOPS / "supplies").is_dir():
        sys.exit(f"No supplies/ folder in {COOPS} (set COOPS to the CoOps vault).")
    sources, skipped = build()
    check = "--check" in sys.argv
    made, kept = [], set()

    def attach(owner, name, src):
        """Make (or, with --check, just look for) a thumbnail and point owner["image"] at it."""
        out = THUMBS / f"{name}.jpg"
        if not check:
            try:
                data = thumbnail(source_photo(name, src))
            except ImportError:
                sys.exit("Thumbnails need Pillow: run ~/.venvs/swatches/bin/python script/sources.py")
            if not out.exists() or out.read_bytes() != data:
                THUMBS.mkdir(parents=True, exist_ok=True)
                out.write_bytes(data)
                made.append(out.name)
        if out.exists():
            owner["image"] = f"sources/{out.name}"
            kept.add(out.name)

    for s in sources:
        src = s.pop("image_src")
        if src:
            attach(s, s["slug"], src)
        for it in s["items"]:
            if "image_src" in it:
                attach(it, it.pop("thumb"), it.pop("image_src"))
        if not src and not any("image" in it for it in s["items"]):
            skipped.append(f"{s['slug']}: no site_image or Image column, so no thumbnail")
    # The folder only holds this script's output: drop thumbnails nothing uses now.
    stale = [] if check or not THUMBS.exists() else [p for p in THUMBS.glob("*.jpg") if p.name not in kept]
    for p in stale:
        p.unlink()
    text = to_yaml(sources)
    current = OUT.read_text() if OUT.exists() else ""
    if check:
        print("up to date" if text == current else "out of date: run python3 script/sources.py")
        sys.exit(0 if text == current else 1)
    if text != current:
        OUT.write_text(text)
    print(f"{'wrote' if text != current else 'unchanged'} {OUT.relative_to(SITE)}: "
          + ", ".join(f"{s['name']} ({len(s['items'])})" for s in sources))
    if made:
        print(f"  thumbnails: {', '.join(made)}")
    if stale:
        print(f"  removed unused: {', '.join(p.name for p in stale)}")
    for s in skipped:
        print(f"  skipped {s}")


if __name__ == "__main__":
    main()
