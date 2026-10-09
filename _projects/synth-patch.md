---
layout: project
title: Synth Patch
slug: synth-patch
main_image: "![[synth-patch-logo.svg]]"
featured: false
categories:
  - code
  - brand
published_date: 2025-10-20
draft: false
gallery_images:
headline: Save a synth patch exactly as it was. Every knob, switch, and cable.
version: "1.0"
tools:
  - claude
process:
redirect_from:
  - /synth-patches/
---

[Synth Patch](https://synthpatch.io) saves synth patches. Each synth is an interactive drawing of its front panel. Turn the knobs, flip the switches, patch the cables, then save it with notes and an audio clip of how it sounds.

I wanted a way to save patches (and some audio clips) for things I'd made on my own synths, and couldn't find a good one. Patch sheets are mostly paper. Manufacturers print blank panel pages in the back of the manual for you to draw and write on, or supply cards that lay over the top of the synth. In 2024 I drew my own as a set of [Figma components and patch templates](https://www.figma.com/community/file/1347614670994807331/synth-components-and-patch-templates). Synth Patch is the interactive version. Built starting July 2025, public at version 2.0 a few months later.

![[synth-patch-patch.png|frame=shadow]]

"Deep Questions" on the Modern Sounds Pluto was the first patch in the Figma sheets. [Here it is in the app](https://app.synthpatch.io/patch/2cbb33ed-3e52-4b74-9be7-4c7817e26ff5).

### The synths

23 synths so far, from Moog, Make Noise, Behringer, Arturia, Dreadbox, Korg, and others. Each one starts as an SVG of the front panel. Magenta circles in a mapping layer mark where each control sits. The setup wizard reads them, and each spot gets a control type: knob, jack, switch, slider, button, LED, pitch wheel, key, and a few more. A new synth is drawing and mapping, not code.

![[synth-patch-explore.png|frame=shadow]]

Every synth has its own page to play with before signing up. Nothing is saved until you use it as a new patch.

![[synth-patch-synth.png|frame=shadow]]

### The patches

A saved patch stores every control as a value and every cable as from and to, with its own color. Add notes and an audio clip. Keep it private, share it by link or publicly, print it, or embed it on another site. Other people's public patches show up in Community Patches.

![[synth-patch-data.png|frame=shadow]]

### Under the hood

Next.js on Vercel, Postgres on Neon, Vercel Blob for the panel graphics and audio, Clerk for accounts and billing. Free for 20 patches, and sharing publicly earns more. Pro is unlimited. The brand site at synthpatch.io is plain static HTML.

The logo is one patch cable that writes S and P, with a plug on each end.
