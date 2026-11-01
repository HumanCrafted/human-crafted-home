---
layout: project
title: EHS Music Boosters
slug: ehs-music-boosters
main_image: "![[ehs-music-boosters-thumbnail.svg]]"
featured: false
categories:
  - code
  - client work
  - brand
published_date: 2026-09-06
draft: false
gallery_images:
headline: A website for the parents behind EHS band and choir.
version: "1.0"
tools:
  - claude
  - figma
process:
---

[EHS Music Boosters](https://ehsmusicboosters.com) is the parent group behind band and choir at Evansville High School, and I am their Secretary. Previously the Boosters didn't have a web presence, so I offered my time to build one out, and along the way I developed a whole brand identity. 

![[ehs-music-boosters-home.png|frame=shadow]]

### Brand in the books

I took inspiration for the Booster identity from the many music books we have around the house. I simply combined a common form of the mezzo 'm' and the musical flat note 'b' for the logo, and then utilized other notation shapes in collages and in other spots around the site. 

![[ehs-music-boosters-logo.svg|EHS Music Boosters logo, an m with a flat sign|column=2]]![[ehs-music-boosters-collage.png|Collage of music notation: mf, bass clef, sharp, treble clef, flat, rest and an eighth note]]

![[ehs-music-boosters-logo-options.svg|Nine EHS Music Boosters logo options]]


### Built on a base

The website runs on a base I put together for quick, repeatable websites: [Astro](https://astro.build), [Keystatic](https://keystatic.com) for editing, [Vercel](https://vercel.com) for hosting. Fully static, no database. Each site is designed in Figma, then the base is copied and reskinned with a handful of color and type tokens. For this website it's a navy on pale blue and cream, with [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) and [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) fonts. The [[ehs-fine-arts-hall-of-fame|EHS Fine Arts Hall of Fame]] runs on the same base.

### The details

Volunteer links go to [[super-simple-signup|Super Simple Signup]], an app I built to get this organization and others away from having to use SignupGenius. There's no contact form, by the club's choice. Just an email link and the officers.

![[ehs-music-boosters-help.png|frame=shadow]]

Concerts, the fall play, and booster meetings for the whole school year sit in one list so parents can easily find them. Any event can carry its own volunteer link. Upcoming events are marked up for search engines (schema.org) with the date and the EHS building they're in.

![[ehs-music-boosters-upcoming.png|frame=shadow]]

### Handing it off

Content is markdown and JSON in the repo, edited in Keystatic with an option for cloud access. Handing it off is just transferring the repo and the Vercel project. No other accounts, no secrets.
