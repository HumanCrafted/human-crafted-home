---
layout: doc
title: Website
slug: website
main_image: 
featured: false
tags:
  - note
  - web-development
published_date: 2025-09-08
gallery_images: 
version: "1.0"
draft: false
---

## Overview

This website was built with the help of Claude Code, and inspired by [Steph Ango's](https://stephango.com/about) use of Obsidian and Jekyll to create a markdown-based static site hosted on GitHub Pages.

## Technology Stack

### Core Framework
- **Jekyll** - Static site generator with GitHub Pages compatibility
- **GitHub Pages** - Free hosting with automatic builds on push to main branch

### Content Management
- **[Obsidian](https://obsidian.md)** - Primary markdown editor for content creation
- **Custom Obsidian Plugin** - Converts `[[wiki-links]]` to Jekyll-compatible URLs
- **Git** - Version control with detailed commit history

### Development Tools
- **Claude Code and Cowork** - AI-powered development assistant for implementation, edits, and content prototyping.
- **[Figma](https://figma.com)** - Design prototyping, reference and specifications. Collaborating with Claude using the Figma MCP
- **[Umami](https://umami.is)** - Privacy-first, cookieless analytics
- **[Loops](https://loops.so)** - Email newsletter, the signup form on the [[follow|Follow]] page, and audience/contact management

## Design System

The site's colors, typography, spacing, and components are documented in the [[design-system|Design System]] note — the single source of truth shared across humancrafted.co and sub-brand tools. In short: IBM Plex Mono for text and IBM Plex Sans for the wordmark and calls to action, a warm paper/ink palette with a yellow brand accent, and a wavy-underline pattern for every interactive link.

### Project Thumbnail Creation
1. **Fusion 360 Drawing**: Create technical drawing and export as DXF
2. **Fusion 360 Render**: Simple render to export PNG with shadow
3. **Adobe Illustrator**: Clean up vector illustration and composite with shadow
4. **Final Format**: SVG for crisp display at any size with automatic dark mode conversion

## Development Details

### Jekyll Collections Structure
- **_projects/** - Portfolio items with image galleries and lightbox functionality
- **_docs/** - Documentation pages including tools, processes, and notes
- **_posts/** - Blog-style content (if needed)
- **_music/** - Track and artist notes, front matter only, `output: false` (no per-track pages). The [[music|Music]] note renders them as one table straight from `site.music`. The `.base` files beside them drive Obsidian's own table view and are excluded from the build, so the two are maintained separately.
- **_places/** - One note per place worth visiting (restaurants, breweries, farms, coffee shops, shops, stays), front matter only, `output: false` — same pattern as music. The [[places|Places]] note renders them as pins on a map. `places.base` gives Obsidian its own table, to-visit, and map views.

#### Track previews
Tracks with an `apple_music_url` get a play button in the Music table — a thirty-second preview, the same one Apple's own embed would give a listener who isn't signed in. Full playback would mean MusicKit JS, a paid developer membership, and each visitor authenticating with their own Apple Music subscription, so it isn't on the table.

The `i=` parameter in an `apple_music_url` is the track's iTunes id, so `script/fetch-previews.py` can look up preview links with no searching or matching and write `preview_url:` into each note. Re-run it after adding tracks, or when previews go stale — they're CDN assets and the links do rot. It rewrites only that one line, and `--dry-run` reports what it would change.

Playback is a plain `<audio>` element in `assets/js/music-player.js`, loaded only on pages whose front matter sets `has_audio: true`. One shared element means starting a track stops whatever was playing. The play/pause icons are injected by the JS rather than written into the note, for the same reason the STL viewer injects its hint icon: kramdown escapes inline SVG that comes out of markdown.

### Custom Features

#### Reference Sections
- Two-column layout: a section label beside an auto-populated, comma-separated list
- Pulls live from Jekyll collections (projects, notes, tools, services, posts)
- Manual item lists with optional links and configurable limits
- Used on the [[core|Core]] page and the [[design-system|Design System]] note

#### Obsidian Integration Plugin
One linking convention, authored in Obsidian and resolved to Jekyll URLs at build time:
- Internal links are `[[slug|Display Text]]` (or `[[slug]]`) — a note's filename is its URL
- Targets are normalized, so `[[Shop V3]]`, `[[shop_v3]]`, and `[[shop-v3]]` all land on the same page
- Images embed with `![[image.ext]]`, with options as pipe segments — `![[plan.svg|width=500]]` sets a display width, and `![[a.svg|column=3]]![[b.svg]]![[c.svg]]` lays a line of embeds out as an equal-column grid (stacking to one column on phones)
- 3D models embed the same way — `![[model.stl]]` becomes a spinnable viewer 
- The same links work in Obsidian's editor and graph view and on the live site
- A build-time safeguard skips stray or empty notes, so a broken link can't take down the site

#### 3D Model Viewer
Some project pages show a real 3D model you can grab and spin, rendered right in the browser
- Authored just like an image — `![[cord-keeper.stl]]` — with the same `width=` option to size the viewer
- Drag to rotate, pinch to zoom; it turns slowly on its own until you touch it
- The 3D library loads only on pages that have a model, and only once you scroll it into view, so every other page stays light

#### Places Map
The [[places|Places]] note plots the `_places` collection on an interactive map — every pin a place featured on Wisconsin Foodie, opened by a Top Chef contestant, recognized by the James Beard Foundation, or simply visited and liked. A place is one note; shows and awards are just fields on it, so a spot with three claims to fame is one pin with three source lines, each linking out (a Wisconsin Foodie pin links to the episode on their YouTube channel — timestamped to the moment the place appears, using the chapter markers the show publishes on its own uploads — the site is an unofficial index that points at the owners' own video, never a copy of it).
- [Leaflet](https://leafletjs.com) vendored in `assets/js/lib/leaflet/` (same `.gitignore` reason as three.js: not `vendor/`), no API key. Tiles are Esri's free "Canvas" basemap (`World_Light/Dark_Gray_Base` only — **not** paired with Esri's own `_Reference` layer, which bundles county lines, city dots, and eventually roads on top of the state-level boundaries + labels the Base layer already bakes in), shown at its native neutral gray with no tint. Light and dark are genuinely different tile sets, not one filtered to fake the other — `setTileTheme()` removes and re-adds the layer on theme flip. Map zoom is capped at `MAX_ZOOM = 10` (tiles, `fitBounds`, and single-pin `setView` all share the constant): past ~11 even the Base layer starts rendering real street grids, so the cap keeps every view — auto-fit or a manual scroll/pinch — inside the clean range while still allowing enough zoom to separate pins clustered in one city. (History: Carto Positron + sepia tint → clashed with the paper background; Esri Base+Reference, no tint → state boundaries "from the theme" but reintroduced clutter; Esri Base alone, zoom-capped, no tint → a warm-tint retry read as "no road definition," reverted; landed on plain neutral gray.)
- Pins are `circleMarker`s with a `--foreground` ring and a fill set by each place's own `color:` front-matter field — a design-system hue name (`olive` for Wisconsin Foodie, `yellow` for Top Chef, `gray` for anywhere permanently closed; `gold`/`slate` reserved for future categories) or a literal color. The color lives in the data, not in a rule buried in the JS; a place with no `color` falls back to `--accent`. Named hues resolve through theme-aware `--ds-*` tokens, so a MutationObserver on `data-theme` swaps every pin to its darker variant the moment the theme flips
- A filter bar above the map (built by the JS from whatever sources exist in the data) toggles each source on and off, each label carrying a color-key dot in that category's dominant pin hue; places with no source count as "personal", and a multi-source place stays visible while any of its sources is on
- Pages opt in with `has_map: true` front matter; `_includes/places-data.html` emits the collection's front matter as JSON and `assets/js/places-map.js` builds the map from it
- Wheel-zoom needs ctrl/meta, matching the STL viewer — plain page scroll is never hijacked. Fullscreen is the exception: there's no page scroll to protect there (body is scroll-locked), so plain wheel zooms directly
- The map height uses `clamp(480px, 65vh, 820px)` rather than a fixed pixel height, so a tall desktop window gets real vertical space instead of a letterboxed strip; the mobile breakpoint still pins it to a flat 360px
- Per-source detail rides in flat front-matter keys (`wf_episode`, `tc_season`, `jb_award`, …) beside a simple `sources:` list — deliberately not nested YAML, so Obsidian Bases and Liquid can both filter on it
- A fullscreen toggle sits top-right next to the zoom control (Leaflet `L.Control`, Lucide maximize/minimize icons). It's a fixed-position overlay (`inset: 0`), not the Fullscreen API, since iOS Safari won't fullscreen arbitrary elements — Escape or the button exits, and `body` scroll locks while it's open. Leaflet sets `container.style.position = "relative"` inline at map init, which beats any stylesheet rule short of `!important`, so the `.is-fullscreen` override needs one. `map.invalidateSize()` fires ~60ms after the class toggle so tiles redraw at the new size instead of leaving gray gaps

#### Tooling Catalog
The [[tooling|Tooling]] note is a catalogue of every cutter that goes in a spindle — one note per bit, tagged `bit`, rendered as a single table straight from `site.docs`. Same shape as the coffee notes: structured front matter drives both the public table and Obsidian's own view.
- Deliberately distinct from [[tools|Tools]], which lists *machines and software*. Tools are what the shop owns; tooling is what it consumes
- Each bit carries a short sharpie serial (`U01`, `C02`, …) — a geometry letter plus a sequence number, so a loose bit in a drawer is identifiable without calipers. The letter encodes the one property you can't see by looking: **U**pcut, **D**owncut, **C**ompression, **V**-bit, **B**allnose, **S**traight
- Feeds and speeds live in a table in each note's body and mirror the presets stored on that tool in the Fusion **hub** library (`hub://Human Crafted`), so the site and the CAM software agree. Fusion's own API can read and write that library but cannot create new ones — `importToolLibrary` fails on the current build, so libraries are made in the Fusion UI and populated from there
- `tooling.base` gives Obsidian its own views: all bits, grouped by diameter, grouped by geometry, a *Needs Attention* filter for anything not `in service`, and a *Reorder* view carrying vendor, part number, price, and purchase link
- Vendor is a plain field plus a `purchase_url`, not a linked note — unlike coffee roasters, there aren't enough vendors to justify their own pages

## Key Decisions

### Why Jekyll?
- GitHub Pages compatibility for free hosting
- Simple markdown-based content management
- Ruby ecosystem with extensive plugins
- Static generation for fast performance

### Why Obsidian?
- Natural wiki-style linking
- Visual graph view for content relationships
- Local-first with cloud sync options
- Markdown preview while writing

### Why Custom Plugin?
- Maintains natural Obsidian workflow
- Automatic URL conversion without manual editing
- Supports both pages and collections
- Preserves link functionality in both environments

## Resources

### Documentation
- Jekyll Documentation - [https://jekyllrb.com](https://jekyllrb.com)
- GitHub Pages Guide - [https://pages.github.com](https://pages.github.com)
- Obsidian Help - [https://help.obsidian.md](https://help.obsidian.md)
- Steph Ango - [https://stephango.com/about](https://stephango.com/about)

