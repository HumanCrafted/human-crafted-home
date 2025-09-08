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
- **Obsidian** - Primary markdown editor for content creation
- **Custom Obsidian Plugin** - Converts `[[wiki-links]]` to Jekyll-compatible URLs
- **Git** - Version control with detailed commit history

### Development Tools
- **Claude Code** - AI-powered development assistant for implementatio and edits
- **Figma** - Design reference and specifications
- **VS Code** - Code editor

## Design System

### Color Palette

#### Light Mode
- **Background**: Tan (#dfd7c8)
- **Text**: Almost Black (#333333)
- **Highlights**: Yellow (#ffff00)
- **Navigation**: Semi-transparent tan with backdrop blur

#### Dark Mode
- **Background**: Almost Black (#333333)
- **Text**: Tan (#dfd7c8)
- **Highlights**: Yellow (#ffff00)
- **Navigation**: Semi-transparent black with backdrop blur

### Typography
- **Primary Font**: IBM Plex Mono
- **Button Font**: Work Sans (700 weight)

### Interactive Elements
- **Hover Effects**: Wavy underline on links using `text-decoration-style: wavy`
- **SVG Filter**: Dark mode applies CSS filter to convert black SVGs to tan color: `filter: invert(91%) sepia(17%) saturate(166%) hue-rotate(1deg) brightness(94%) contrast(88%)`

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

#### Wiki Section System
- Collapsible content sections using HTML details/summary elements
- Auto-population from Jekyll collections
- Manual item lists with optional links
- Configurable limits and expansion states

#### Obsidian Integration Plugin
- Seamless conversion of `[[page-name]]` links
- Support for display text: `[[page|Display Text]]`
- Image embedding with `![[image.ext]]` syntax
- Works across all collections and pages

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

