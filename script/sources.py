#!/usr/bin/env python3
"""Write _data/sources.yml (the /sources/ page) from the CoOps supply notes.

CoOps is the record; this copies across only what the site shows. A supply note
(CoOps supplies/*.md, `type: supply`) is listed once it carries `site: true`.
From its "On hand" table each row gives the item (first column), Part, Vendor
and the URL in Link. Prices, counts and pack sizes are never copied. A row with
no vendor yet, or whose item is a placeholder, is skipped; a placeholder Part or
Link is just left off.

Used for comes from the CoOps product notes the same way the components view
works it out: any table with a Supply (or Printed on) column naming the supply,
plus product slugs under Used for in the supply's own On hand table. A supply
that isn't part of a product (filament containers) can name a site page slug in
its own `used_for:` property instead (`used_for: 3d-printer`).

    python3 script/sources.py            # write _data/sources.yml
    python3 script/sources.py --check    # report whether it's out of date

COOPS overrides where the CoOps vault is (defaults to the iCloud path).
"""
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

SITE = Path(__file__).resolve().parent.parent
COOPS = Path(os.environ.get("COOPS", Path.home() / "Library/Mobile Documents/iCloud~md~obsidian/Documents/CoOps"))
OUT = SITE / "_data/sources.yml"


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


def build():
    products = list(notes("products", "product"))
    order = {slug: (fm.get("product") or slug) for slug, fm, _ in products}

    sources, skipped = [], []
    for slug, fm, T in notes("supplies", "supply"):
        if fm.get("site") is not True:
            continue
        rows = T.get("On hand", [])
        used = set()
        for p_slug, _, PT in products:
            for t in PT.values():
                if any(slug in (r.get("Supply"), r.get("Printed on")) for r in t):
                    used.add(p_slug)
        for r in rows:
            used |= {s for s in re.split(r"[\s,]+", r.get("Used for", "")) if s in order}
        # Supplies that aren't part of a product (shop gear) name a site page instead.
        extra = [s for s in re.split(r"[\s,]+", str(fm.get("used_for") or "")) if s]

        items = []
        for r in rows:
            item = next(iter(r.values()), "")
            if not filled(item) or not filled(r.get("Vendor")):
                skipped.append(f"{slug}: {item or '(blank row)'} (no vendor yet)" if filled(item) else f"{slug}: {item or '(blank row)'}")
                continue
            entry = {"item": item}
            if filled(r.get("Part")):
                entry["part"] = r["Part"]
            entry["vendor"] = r["Vendor"]
            url = link_url(r.get("Link", ""))
            if url:
                entry["url"] = url
            items.append(entry)
        if not items:
            skipped.append(f"{slug}: nothing to show, left off the page")
            continue
        sources.append({
            "name": fm.get("supply") or slug,
            "slug": slug,
            "used_for": sorted(used, key=lambda s: order[s]) + extra,
            "items": items,
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
        lines.append("  used_for: [" + ", ".join(q(u) for u in s["used_for"]) + "]")
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
    text = to_yaml(sources)
    current = OUT.read_text() if OUT.exists() else ""
    if "--check" in sys.argv:
        print("up to date" if text == current else "out of date: run python3 script/sources.py")
        sys.exit(0 if text == current else 1)
    if text != current:
        OUT.write_text(text)
    print(f"{'wrote' if text != current else 'unchanged'} {OUT.relative_to(SITE)}: "
          + ", ".join(f"{s['name']} ({len(s['items'])})" for s in sources))
    for s in skipped:
        print(f"  skipped {s}")


if __name__ == "__main__":
    main()
