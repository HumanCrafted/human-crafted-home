---
layout: project
title: EHS Fine Arts Hall of Fame
slug: ehs-fine-arts-hall-of-fame
main_image: "![[ehs-fine-arts-hall-of-fame-thumbnail.svg]]"
featured: false
categories:
  - code
  - client work
  - brand
published_date: 2026-09-21
draft: false
gallery_images:
headline: A home online for the Evansville High School Fine Arts Hall of Fame.
version: "1.0"
tools:
  - claude
  - figma
process:
---

[evansvillefineartshof.org](https://evansvillefineartshof.org) is the website for the Evansville High School Fine Arts Hall of Fame. Since 2019 it has honored alumni, teachers and supporters of the school's music, theater and visual arts programs. The effort was dormant for a few years, but the school is trying to re-boot it this year, so I offered my help to create a landing page and nomination flow for them.

![[ehs-fine-arts-hall-of-fame-home.png|frame=shadow]]

### The design

Midnight navy, brass linework and ivory type, [Fraunces](https://fonts.google.com/specimen/Fraunces) for headlines, [Marcellus](https://fonts.google.com/specimen/Marcellus) for the engraved names. The logo mark is a portion borrowed from the district's existing logo, but with a base that emulates an award.

![[ehs-fine-arts-hall-of-fame-district-logo.png|Evansville Community School District logo|column=2]]![[ehs-fine-arts-hall-of-fame-logo.svg|Fine Arts Hall of Fame mark, the flame on a two-bar base]]


### Nominating

I used Claude.ai to assist with creating self-hosted nomination forms. Submissions go straight to the committee's inbox, with no form service in between.

![[ehs-fine-arts-hall-of-fame-form.png|frame=shadow]]

Some people still want paper, so Claude.ai built a script that makes a fillable PDF with real form fields that work in Preview, Chrome, Acrobat and on a phone. 

![[ehs-fine-arts-hall-of-fame-pdf.png|width=500|frame=shadow]]

### Under the hood

Built on the same base as the [[ehs-music-boosters|EHS Music Boosters]] site: [Astro](https://astro.build), [Keystatic](https://keystatic.com) for editing, [Vercel](https://vercel.com) for hosting. The content is markdown in a git repo. 
