#!/usr/bin/env python3
"""Fill in `preview_url:` on track notes from Apple's iTunes lookup API.

The `i=` parameter in a track's `apple_music_url` is its iTunes track id, so no
searching or matching is needed — the id we already have is the id we look up.
Re-run any time tracks are added or preview links go stale; it rewrites the
`preview_url:` line in place and leaves every other line untouched.

    python3 fetch_previews.py [--dry-run]
"""

import json
import re
import sys
import urllib.request
from pathlib import Path

TRACKS = Path(__file__).resolve().parent.parent / "_music" / "tracks"
BATCH = 100  # the lookup endpoint accepts many ids per call; keep it polite

# The quotes are optional — Obsidian will happily save a bare URL if one is
# pasted in by hand, and an unquoted link is still a link.
url_re = re.compile(r'^apple_music_url:\s*"?(\S+?)"?\s*$', re.M)
preview_re = re.compile(r'^preview_url:.*\n', re.M)


def track_id(apple_url):
    m = re.search(r"[?&]i=(\d+)", apple_url)
    return m.group(1) if m else None


def lookup(ids):
    """Map iTunes track id -> preview URL, for whatever the API returns."""
    out = {}
    for i in range(0, len(ids), BATCH):
        chunk = ids[i : i + BATCH]
        api = "https://itunes.apple.com/lookup?id=" + ",".join(chunk)
        with urllib.request.urlopen(api, timeout=30) as r:
            data = json.load(r)
        for result in data.get("results", []):
            if result.get("previewUrl"):
                out[str(result["trackId"])] = result["previewUrl"]
    return out


def main():
    dry = "--dry-run" in sys.argv
    if not TRACKS.is_dir():
        sys.exit(f"no track directory at {TRACKS}")

    wanted = {}  # path -> track id
    skipped = []
    for path in sorted(TRACKS.glob("*.md")):
        text = path.read_text()
        m = url_re.search(text)
        if not m:
            skipped.append(path.name)
            continue
        tid = track_id(m.group(1))
        if tid:
            wanted[path] = tid
        else:
            skipped.append(path.name)

    previews = lookup(sorted(set(wanted.values())))

    written = missing = unchanged = 0
    for path, tid in wanted.items():
        preview = previews.get(tid)
        if not preview:
            missing += 1
            print(f"  no preview returned: {path.name} (id {tid})")
            continue

        text = path.read_text()
        line = f'preview_url: "{preview}"\n'
        if preview_re.search(text):
            if f'preview_url: "{preview}"' in text:
                unchanged += 1
                continue
            new = preview_re.sub(line, text, count=1)
        else:
            # Sit it directly under apple_music_url, the field it derives from.
            new = url_re.sub(lambda m: m.group(0) + "\n" + line.rstrip(), text, count=1)
        if not dry:
            path.write_text(new)
        written += 1

    print(
        f"\n{written} written, {unchanged} already current, {missing} with no preview, "
        f"{len(skipped)} without an Apple Music link"
        + (" (dry run — nothing saved)" if dry else "")
    )


if __name__ == "__main__":
    main()
