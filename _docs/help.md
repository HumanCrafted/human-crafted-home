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
- Images: `![[file.ext]]` — files live in `assets/images/`. Alt text: `![[file.ext|alt]]`. Sizing and columns are pipe options too — see "Inline images" below.

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

To resize: add a `width=` option — no need to edit the SVG or write CSS:

```
![[vennColab.svg|width=500]]
![[vennColab.svg|a caption|width=500]]
```

Options go after the filename as `|`-separated segments, in any order:

| Segment | Does | Values |
| --- | --- | --- |
| `alt text` | alt text for the image | any text |
| `width=` | display width in px on the built site | number |
| `column=` | lays a line of embeds out as equal columns (below) | number |

A bare number (`![[img.svg|500]]` — what Obsidian writes when you drag-resize an image in the editor) is read as `width=` too, so it never ends up as alt text. Obsidian's preview resizes on the bare-number form but ignores `width=`; the built site honors both.

### Columns

Blank line between embeds → stacked, one per paragraph. For side-by-side, write the embeds back-to-back on ONE line and put `column=` on the first:

```
![[imageA.svg|column=2]]![[imageB.svg]]
![[a.svg|column=3]]![[b.svg]]![[c.svg]]
```

- Equal widths, top-aligned, with a consistent gap — no image sizing needed.
- More images than columns wrap to new rows: six embeds with `column=3` make two rows of three.
- On phones (≤768px) the whole thing collapses to a single full-width column.
- No `column=` → no special layout. A line of adjacent embeds without it just renders as inline images.
- In Obsidian's preview the `column=` segment reads as alt text and the images stack — the columns appear on the built site.

## 3D models

`![[file.stl]]` embeds a drag-to-spin 3D viewer — same shape as an image embed, but the file lives in `assets/models/` (not `assets/images/`). Drop the `.stl` there and reference it by name. Obsidian's editor shows it as an unresolved embed (it can't render STLs), but it's valid — it comes alive on the built site.

Options go after the filename as `|`-separated segments, in any order:

| Segment | Does | Values |
| --- | --- | --- |
| `A label` | screen-reader label (not shown on the page) | any text |
| `spin=` | which way it idly turns, seen from above | `ccw` (default), `cw`, `off` |
| `up=` | which of the model's own axes points up | `+y` (default), `+z`, `-x`, … (bare `z` = `+z`) |
| `width=` | viewer width in px — same key as images | number (default 480) |

Examples:

```
![[cord-keeper.stl]]
![[cord-keeper.stl|spin=off]]
![[cord-keeper.stl|width=700]]
![[widget.stl|A brass widget|up=+z|spin=cw]]
```

`width=` scales the whole viewer, model included — height follows automatically to keep the standard proportions. Going much below the default makes the model shrink faster than you'd expect (the box gets too narrow for the spin envelope); sizes at 480 and up behave intuitively.

`up=` is the one to remember. Most CAD exports (Fusion) are Z-up and come in lying on their side — add `up=+z` to stand them upright. If the model already sits right, leave it off (`+y` is the default). Everything else is optional: a bare `![[file.stl]]` just works.
