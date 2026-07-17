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

### Custom Features

#### Reference Sections
- Two-column layout: a section label beside an auto-populated, comma-separated list
- Pulls live from Jekyll collections (projects, notes, tools, posts)
- Manual item lists with optional links and configurable limits
- Used on the [[core|Core]] page and the [[design-system|Design System]] note

#### Obsidian Integration Plugin
One linking convention, authored in Obsidian and resolved to Jekyll URLs at build time:
- Internal links are `[[slug|Display Text]]` (or `[[slug]]`) — a note's filename is its URL
- Targets are normalized, so `[[Shop V3]]`, `[[shop_v3]]`, and `[[shop-v3]]` all land on the same page
- Images embed with `![[image.ext]]`
- 3D models embed the same way — `![[model.stl]]` becomes a spinnable viewer 
- The same links work in Obsidian's editor and graph view and on the live site
- A build-time safeguard skips stray or empty notes, so a broken link can't take down the site

#### 3D Model Viewer
Some project pages show a real 3D model you can grab and spin, rendered right in the browser
- Authored just like an image — `![[cord-keeper.stl]]` 
- Drag to rotate, pinch to zoom; it turns slowly on its own until you touch it
- The 3D library loads only on pages that have a model, and only once you scroll it into view, so every other page stays light

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

