---
layout: project
title: Dims and Units
slug: dims-and-units
main_image: "![[dims+units-logos.svg]]"
featured: false
categories:
  - code
published_date: 2026-07-12
draft: false
gallery_images:
headline: "Two Figma plugins that bring real-world units to a pixel canvas."
version: "1.0"
tools:
  - claude
process:
---

Figma is my vector drawing tool of choice, but they have resisted adding features to allow real-world units like inches and feet. Dims and Units are two small plugins that fix that, built over a weekend with help from Claude.

### Dims

A CAD-style dimension annotation tool. Drop a well-formatted callout — line, arrows, witness lines, and a value label that reads like real drafting — and it carries real-world units instead of screen pixels. Figma has no native equivalent, so Dims fills the gap for anyone doing technical work who wants proper dimension callouts.

Every dimension is built from standard Figma vectors and frames. No custom rendering. Each one is an auto-layout frame, so Figma stretches it in both axes as you drag and the label recomputes on its own. Eight variants — horizontal and vertical, standard and inline label, plus flip — from a grid of one-click drop buttons. Adjustable arrow styles, stroke, font, and witness-line spacing.

![[Dims_Logo-Name.svg]]![[Dims_Thumbnail.png]]

### Units

Draw a box or line, type a width and/or height in a real-world unit at a chosen DPI and scale, and Units converts to pixels and resizes the node. Set both dimensions or just one. Lock the aspect ratio and scale the other axis proportionally. Works on any resizable node — shapes, groups, frames — and reads a line's width as its geometric length.

![[Units_Logo-Name.svg]]![[Units_Thumbnail.png]]

Both handle in, ft, mm, cm, and m, with a configurable DPI and drawing scale (enter `1`, `0.25`, or a fraction like `1/4`).

Both are open source and MIT licensed on GitHub: [Dims](https://github.com/HumanCrafted/figma-dims) and [Units](https://github.com/HumanCrafted/figma-units).

