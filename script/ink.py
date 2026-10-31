#!/usr/bin/env python3
"""Keep the site's SVG drawings in the design system's ink, never pure black.

The page's ink is #2A2824 (--foreground). Drawings exported from Illustrator or
Figma arrive in pure black (or the old #333333), and many say no colour at all,
which SVG also renders black. Dark mode maps ink to the dark-mode text colour
with one exact colour map (the `ink-dark` filter in _layouts/default.html), so
a drawing in any other near-black shows up grey there.

For every SVG in assets/images/ (except SKIP) this script:

- rewrites black, #000, #000000, #333 and #333333 to #2A2824 wherever they are
  a visible colour: fill/stroke/stop-color/color attributes, style="" and
  <style> rules;
- gives the root <svg> fill="#2A2824" when it sets no fill, so shapes that said
  no colour (SVG's default black) come out in ink too;
- leaves <mask> and <clipPath> contents alone: there black and white decide
  what is cut away, not what you see;
- reports any visible white. Drawings are cut shapes on a transparent ground,
  so white is a leftover to fix in the source, not something to recolour.

    python3 script/ink.py          # recolour in place
    python3 script/ink.py --check  # list what would change; exit 1 if anything would
"""
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
IMAGES = SITE / "assets/images"
INK = "#2A2824"

# Not drawings: white social-network glyphs (made for dark grounds, unused) and
# the Made wordmark, which is inlined and takes currentColor.
SKIP = {
    "Apple.svg", "Discord.svg", "Facebook.svg", "Figma.svg", "Github.svg",
    "Instagram.svg", "LinkedIn.svg", "Medium.svg", "Pinterest.svg", "Reddit.svg",
    "Snapchat.svg", "Threads.svg", "WhatsApp.svg", "X-Twitter.svg", "YouTube.svg",
    "made-wordmark.svg",
}

BLACKS = {"black", "#000", "#000000", "#333", "#333333", "rgb(0,0,0)"}
WHITES = {"white", "#fff", "#ffffff", "rgb(255,255,255)"}
PROPS = r"(?:fill|stroke|stop-color|flood-color|lighting-color|color)"
ATTR_RE = re.compile(rf'(\b{PROPS}\s*=\s*")([^"]*)(")', re.I)
CSS_RE = re.compile(rf"((?<![\w-]){PROPS}\s*:\s*)([^;}}\"]+)", re.I)
HIDDEN_RE = re.compile(r"<(mask|clipPath)\b.*?</\1\s*>", re.S | re.I)
ROOT_RE = re.compile(r"<svg\b[^>]*>", re.I)
SHAPE_RE = re.compile(r"<(?:path|rect|circle|ellipse|polygon|polyline|use|text)\b[^>]*>", re.I)


def norm(value):
    return re.sub(r"\s+", "", value).lower()


def recolor(part, whites):
    def swap(m):
        value = norm(m.group(2))
        if value in WHITES:
            whites.append(m.group(0).strip())
        return m.group(1) + INK + m.group(3) if value in BLACKS else m.group(0)

    def swap_css(m):
        value = norm(m.group(2))
        if value in WHITES:
            whites.append(m.group(0).strip())
        return m.group(1) + INK if value in BLACKS else m.group(0)

    return CSS_RE.sub(swap_css, ATTR_RE.sub(swap, part))


def ink(text):
    """Return (new text, visible whites, problems)."""
    whites, problems, out, pos = [], [], [], 0
    for m in HIDDEN_RE.finditer(text):
        out.append(recolor(text[pos:m.start()], whites))
        out.append(m.group(0))
        pos = m.end()
    out.append(recolor(text[pos:], whites))
    text = "".join(out)

    root = ROOT_RE.search(text)
    if root and not re.search(r"\sfill\s*=", root.group(0)):
        # A mask shape with no fill of its own would inherit the ink and stop
        # cutting cleanly, so leave those files for a person to look at.
        bare = [s for m in HIDDEN_RE.finditer(text) if m.group(1).lower() == "mask"
                for s in SHAPE_RE.findall(m.group(0)) if "fill" not in s]
        if bare:
            problems.append("mask shape without a fill; root fill not added")
        else:
            tag = root.group(0)
            new = tag[:-2] + f' fill="{INK}"/>' if tag.endswith("/>") else tag[:-1] + f' fill="{INK}">'
            text = text[:root.start()] + new + text[root.end():]
    return text, whites, problems


def main():
    check = "--check" in sys.argv[1:]
    changed, flagged = [], []
    for path in sorted(IMAGES.glob("*.svg")):
        if path.name in SKIP:
            continue
        before = path.read_text(encoding="utf-8")
        after, whites, problems = ink(before)
        if whites or problems:
            flagged.append((path.name, whites[:3] + problems))
        if after != before:
            changed.append(path.name)
            if not check:
                path.write_text(after, encoding="utf-8")

    verb = "would recolour" if check else "recoloured"
    print(f"{verb} {len(changed)} drawing(s)" + (":" if changed else ""))
    for name in changed:
        print(f"  {name}")
    for name, notes in flagged:
        print(f"check {name}: " + "; ".join(notes))
    if check and (changed or flagged):
        sys.exit(1)


if __name__ == "__main__":
    main()
