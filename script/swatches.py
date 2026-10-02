#!/usr/bin/env python3
"""Generate consistent square swatches from the vendor photos in assets/images/.

Each material note in _materials/ has an `image:` — the vendor's own photo,
shot three different ways (Canal: flat-on, Cohn: a tilted chip in a studio
render, Tap: an angled sheet). This finds the sheet in that photo, straightens
it to a square (crop + rotate, plus a perspective fix where the sheet is
tilted), insets past the edges and corners, evens out the lighting, and writes
`assets/images/<slug>-swatch.jpg`. It then records that file as `swatch:` on
the note. The original `image:` is never touched.

Textured Cohn colours (pearl, glitter, flake) are the exception to "use the
photo we have": in our copies the chip is only ~100px across, too little to
show flecks or sparkle. For those the script fetches Cohn's full-size render
of the same picture (found via the note's `purchase_url`), checks it really is
the same picture, and cuts the swatch from that instead. Downloads are cached
in ~/.cache/hc-swatches/ so re-runs don't fetch again; --offline skips them.

    ~/.venvs/swatches/bin/python script/swatches.py [slug ...] [--debug DIR] [--dry-run]

No slugs = every note with an `image:`. --debug writes a side-by-side of each
source (with the detected outline) and its swatch to DIR for eyeballing.
Needs numpy, opencv-python-headless and pillow, in a venv kept OUTSIDE the
vault (iCloud and Obsidian would otherwise sync thousands of library files):

    python3 -m venv ~/.venvs/swatches && ~/.venvs/swatches/bin/pip install numpy opencv-python-headless pillow
"""

import argparse
import json
import re
import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
MATERIALS = ROOT / "_materials"
IMAGES = ROOT / "assets" / "images"
CACHE = Path.home() / ".cache" / "hc-swatches"

SIZE = 480  # output square, px

# Finishes whose look IS the texture. Everything else (opaque, transparent,
# fluorescent, frosted) is one even colour, so any speckle or banding in those
# is JPEG noise from the vendor photo and gets smoothed away.
TEXTURED = {"pearl", "glitter", "flake", "glimmer"}

# How far in from the detected outline to crop, as a fraction of the face.
# Enough to clear bevelled edges, edge glare and (Cohn) the rounded corners.
INSET = {"canal": 0.06, "cohn": 0.17, "tap": 0.10}


# ---------------------------------------------------------------- notes

def front_matter(text, key):
    m = re.search(rf"^{key}:\s*(.*)$", text, re.M)
    return m.group(1).strip().strip('"') if m else None


def vendor_key(vendor):
    v = (vendor or "").lower()
    for k in ("canal", "cohn", "tap"):
        if k in v:
            return k
    return None


def set_swatch(path, filename):
    """Write `swatch:` right after `image:`, replacing any existing value."""
    text = path.read_text()
    line = f"swatch: {filename}\n"
    if re.search(r"^swatch:.*\n", text, re.M):
        text = re.sub(r"^swatch:.*\n", line, text, count=1, flags=re.M)
    else:
        text = re.sub(r"^(image:.*\n)", r"\1" + line, text, count=1, flags=re.M)
    path.write_text(text)


# ---------------------------------------------------------------- Cohn full-size renders

def cohn_full_render(purchase_url, ours):
    """Cohn's full-size render of the product, or None. Cohn is a Shopify store,
    so /products/<handle>.json lists the product's images; the first is the
    floating-chip render our `image:` was cut down from. Only the image is
    used from that feed — its prices are CAD and not what the page shows."""
    m = re.search(r"/products/([^/?#]+)", purchase_url or "")
    if not m:
        return None
    handle = m.group(1)
    path = CACHE / f"cohn-{handle}.jpg"
    if not path.exists():
        with urllib.request.urlopen(f"https://www.cohnacrylics.com/products/{handle}.json", timeout=30) as r:
            src = json.load(r)["product"]["images"][0]["src"].split("?")[0]
        CACHE.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(src, timeout=60) as r:
            path.write_bytes(r.read())
    full = cv2.imread(str(path), cv2.IMREAD_COLOR)
    # Make sure it's the same picture as ours — Cohn sometimes reshoots or
    # reorders product images. Compare at our size; same render ≈ tiny diff.
    small = cv2.resize(full, (ours.shape[1], ours.shape[0]), interpolation=cv2.INTER_AREA)
    diff = np.abs(small.astype(np.int16) - ours.astype(np.int16)).mean()
    if diff > 12:
        raise ValueError(f"Cohn's full-size render doesn't match our image (diff {diff:.0f}); using ours would be safer — rerun with --offline")
    return full


# ---------------------------------------------------------------- finding the sheet

def load_rgb(path):
    img = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
    if img.ndim == 3 and img.shape[2] == 4:
        # Flatten any transparency onto white, which is what the vendor shot on.
        alpha = img[:, :, 3:4].astype(np.float32) / 255
        img = (img[:, :, :3] * alpha + 255 * (1 - alpha)).astype(np.uint8)
    return img  # BGR


def quad_from_mask(mask):
    """Four corners of the largest blob, ordered TL, TR, BR, BL."""
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = max(contours, key=cv2.contourArea)
    hull = cv2.convexHull(c)
    peri = cv2.arcLength(hull, True)
    # Grow the tolerance until the hull reduces to four corners. Rounded
    # corners (Cohn) get cut across, which the inset then clears.
    for eps in np.linspace(0.01, 0.12, 45):
        approx = cv2.approxPolyDP(hull, eps * peri, True)
        if len(approx) == 4:
            return order_corners(approx.reshape(4, 2).astype(np.float32))
    # Fall back to the tightest rotated rectangle.
    return order_corners(cv2.boxPoints(cv2.minAreaRect(hull)).astype(np.float32))


def order_corners(pts):
    # Start from the corner nearest the top-left, then go clockwise.
    c = pts.mean(axis=0)
    ang = np.arctan2(pts[:, 1] - c[1], pts[:, 0] - c[0])
    pts = pts[np.argsort(ang)]  # clockwise in image coords, starting near left
    start = np.argmin(pts.sum(axis=1))
    return np.roll(pts, -start, axis=0)


def mask_on_white(img, thresh=10):
    """Canal and Tap: the sheet is whatever isn't the white backdrop."""
    diff = 255 - img.min(axis=2).astype(np.int16)
    mask = (diff > thresh).astype(np.uint8) * 255
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    return mask


def mask_cohn(img):
    """Cohn: the chip floats above a pedestal in a same-hued studio render, so
    there's no clean backdrop to subtract. GrabCut from a box around the upper
    middle of the frame, where the chip always sits, separates it."""
    h, w = img.shape[:2]
    rect = (int(w * 0.18), int(h * 0.04), int(w * 0.64), int(h * 0.62))
    mask = np.zeros((h, w), np.uint8)
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(img, mask, rect, bgd, fgd, 6, cv2.GC_INIT_WITH_RECT)
    fg = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    return fg


# ---------------------------------------------------------------- straighten + tidy

def straighten(img, quad, inset):
    """Warp the quad to a square, then crop `inset` off every side."""
    big = SIZE * 2  # warp oversized, crop, then downsample once
    dst = np.float32([[0, 0], [big, 0], [big, big], [0, big]])
    M = cv2.getPerspectiveTransform(quad, dst)
    warped = cv2.warpPerspective(img, M, (big, big), flags=cv2.INTER_CUBIC)
    m = int(big * inset)
    return warped[m:big - m, m:big - m]


def even_lighting(img):
    """Take out the slow light falloff across the sheet (studio gradients,
    vignetting) and keep the texture: subtract a heavy blur of the lightness
    and add back its median. Glitter, flake and pearl are fine detail, so they
    survive; a flat colour comes out flat."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    L = lab[:, :, 0]
    sigma = img.shape[0] / 4
    low = cv2.GaussianBlur(L, (0, 0), sigma)
    lab[:, :, 0] = np.clip(L - low + np.median(L), 0, 255)
    return cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR)


def smooth_flat(img):
    """A flat colour has nothing to keep at fine scale; blur out the JPEG
    blocking and banding the lighting pass would otherwise leave visible."""
    return cv2.GaussianBlur(img, (0, 0), img.shape[0] / 60)


def make_swatch(img, vendor, finish):
    if vendor == "cohn":
        # GrabCut is slow on a full-size render; find the chip on a ~800px
        # copy and scale the corners back up.
        scale = min(1.0, 800 / img.shape[1])
        small = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
        quad = quad_from_mask(mask_cohn(small)) / scale
    else:
        quad = quad_from_mask(mask_on_white(img))
    out = straighten(img, quad, INSET[vendor])
    out = even_lighting(out)
    if finish not in TEXTURED:
        out = smooth_flat(out)
    out = cv2.resize(out, (SIZE, SIZE), interpolation=cv2.INTER_AREA)
    return out, quad


def debug_sheet(img, quad, swatch):
    show = img.copy()
    cv2.polylines(show, [quad.astype(np.int32)], True, (0, 0, 255), 2)
    scale = SIZE / show.shape[0]
    show = cv2.resize(show, (int(show.shape[1] * scale), SIZE))
    return np.hstack([show, np.full((SIZE, 12, 3), 255, np.uint8), swatch])


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slugs", nargs="*")
    ap.add_argument("--debug", type=Path)
    ap.add_argument("--dry-run", action="store_true", help="don't write swatches or notes")
    ap.add_argument("--offline", action="store_true", help="don't fetch Cohn full-size renders")
    args = ap.parse_args()

    notes = sorted(MATERIALS.glob("*.md"))
    if args.slugs:
        notes = [n for n in notes if n.stem in args.slugs]
    if args.debug:
        args.debug.mkdir(parents=True, exist_ok=True)

    failed = 0
    for note in notes:
        text = note.read_text()
        image, vendor = front_matter(text, "image"), vendor_key(front_matter(text, "vendor"))
        finish = (front_matter(text, "finish") or "").lower()
        if not image or not vendor:
            print(f"skip  {note.stem}: no image or unknown vendor")
            continue
        vendor_note = ""
        try:
            src = load_rgb(IMAGES / image)
            if vendor == "cohn" and finish in TEXTURED and not args.offline:
                full = cohn_full_render(front_matter(text, "purchase_url"), src)
                if full is not None:
                    src, vendor_note = full, " full-size"
            swatch, quad = make_swatch(src, vendor, finish)
        except Exception as e:  # one bad photo shouldn't stop the batch
            print(f"FAIL  {note.stem}: {e}")
            failed += 1
            continue
        name = f"{note.stem}-swatch.jpg"
        if not args.dry_run:
            cv2.imwrite(str(IMAGES / name), swatch, [cv2.IMWRITE_JPEG_QUALITY, 90])
            set_swatch(note, name)
        if args.debug:
            cv2.imwrite(str(args.debug / f"{note.stem}.jpg"), debug_sheet(src, quad, swatch))
        print(f"ok    {note.stem} ({vendor}{vendor_note})")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
