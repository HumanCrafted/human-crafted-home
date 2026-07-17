---
layout: doc
title: Help
slug: help
main_image:
featured: false
tags:
  - about
published_date: 2026-07-10
gallery_images:
version: "1.0"
draft: true
---

Notes to myself for writing and building pages on this site — a working cheat sheet, not a published page.

## Markdown basics

The everyday formatting. Left column is what you type, right is what it does.

| Write this | Get this |
| --- | --- |
| `**bold**` | bold |
| `*italic*` or `_italic_` | italic |
| `***bold italic***` | bold + italic |
| `~~strikethrough~~` | struck out |
| `` `inline code` `` | inline code |
| `> quoted text` | blockquote |
| `## Heading`, `### Subheading` | section headings (skip `#` — the title handles H1) |
| `- item` | bulleted list |
| `1. item` | numbered list |

Divider (horizontal rule) — three dashes on their own line, with a blank line above and below:

```
---
```

Code block — wrap lines in triple backticks, with the language after the opening fence for syntax highlighting:

~~~
```css
img { max-width: 100%; }
```
~~~

One gotcha: lists need a blank line before the first item, or they render as one run-on paragraph.

## Linking

One link style, everywhere. Authored in Obsidian, built by Jekyll — both only understand this one.

- Internal links: `[[slug|Display Text]]` (or just `[[slug]]`). `slug` is the target note's filename without `.md`. Example: `[[shop-v3|the new shop]]`. Works in Obsidian and resolves on the built site.
- Images: `![[file.ext]]` — files live in `assets/images/`. Alt text: `![[file.ext|alt]]`.

Don't hand-write `[text](path.md)` markdown links. They break for `_projects/` and root paths, and typing one to a note that doesn't exist yet makes Obsidian auto-create an empty `.md` — which used to take down the whole build.

How it resolves: the target gets slugified (lowercased, spaces/underscores → hyphens), so `[[Shop V3]]`, `[[shop_v3]]`, and `[[shop-v3]]` all map to `/shop-v3/`. Post links drop their `YYYY-MM-DD-` filename prefix.

To show a literal `[[slug]]` or `![[img]]` as an example (like right here), wrap it in `inline code` or a fenced block. The plugin leaves anything inside code untouched.

## Inline images

`![[file.svg]]` renders as a plain `<img>`. No width in the markdown — the image lays out at its own natural size.

For SVGs, "natural size" is the `width`/`height` on the root `<svg>` tag. `vennColab.svg` opens with `width="500"`, so it draws at 500px. The only global rule touching it is:

```css
img { max-width: 100%; height: auto; }
```

That doesn't set a width — it just caps the image at the column width and keeps the aspect ratio. So it renders at 500px until the column drops below 500px, then scales down.

To resize: change `width` in the SVG file, or add CSS targeting the image. Set just `width` (leave `height: auto`) so you don't fight the aspect ratio.

### Two images — stacked or side by side?

`<img>` is inline, so it comes down to paragraph wrapping. The content column is 84% of the viewport, capped at 1200px — wide enough to fit two 500px images on one row.

Blank line between them → two separate paragraphs → stacked:

```
![[imageA.svg]]

![[imageB.svg]]
```

No blank line (same line or back-to-back) → same paragraph → side by side, space permitting:

```
![[imageA.svg]] ![[imageB.svg]]
```

If the column can't fit both, the second wraps below. For a reliable side-by-side with a controlled gap, wrap them in a flex container instead of relying on inline behavior.

## 3D models

`![[file.stl]]` embeds a drag-to-spin 3D viewer — same shape as an image embed, but the file lives in `assets/models/` (not `assets/images/`). Drop the `.stl` there and reference it by name. Obsidian's editor shows it as an unresolved embed (it can't render STLs), but it's valid — it comes alive on the built site.

Options go after the filename as `|`-separated segments, in any order:

| Segment | Does | Values |
| --- | --- | --- |
| `A label` | screen-reader label (not shown on the page) | any text |
| `spin=` | which way it idly turns, seen from above | `ccw` (default), `cw`, `off` |
| `up=` | which of the model's own axes points up | `+y` (default), `+z`, `-x`, … (bare `z` = `+z`) |

Examples:

```
![[cord-keeper.stl]]
![[cord-keeper.stl|spin=off]]
![[widget.stl|A brass widget|up=+z|spin=cw]]
```

`up=` is the one to remember. Most CAD exports (Fusion) are Z-up and come in lying on their side — add `up=+z` to stand them upright. If the model already sits right, leave it off (`+y` is the default). Everything else is optional: a bare `![[file.stl]]` just works.
