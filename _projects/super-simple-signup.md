---
layout: project
title: Super Simple Signup
slug: super-simple-signup
main_image: "![[super-simple-signup-logo.svg]]"
featured: false
categories:
  - code
  - brand
published_date: 2026-09-30
draft: false
gallery_images:
headline: A signup sheet in one link. No accounts, no ads, and it's free.
version: "1.0"
tools:
  - claude
process:
---

[Super Simple Signup](https://supersimplesignup.com) is a signup sheet in one link. Make a sheet, share it, people pick a slot. Everyone gets a reminder the day before. No accounts, no ads, and it's free.

I wanted the simplest possible version of SignUpGenius without all of the ads so organizers at our kids schools could use it (and I could too). Built with Claude in a few days. Version 1.0 was live on day one, improvements have been added over time.

![[super-simple-signup-home.png]]

### No accounts

Nobody signs in. The organizer fills out one form and gets an email with a confirm link. That link opens the manage page where the creator can edit and watch signups. Everyone who signs up for a slot gets their own link to change or cancel. Having the link is the permission, the same way Doodle works. 

![[super-simple-signup-manage.png]]

### Signing up

Pick as many slots as you like, type your name and email once. You'll get a confirmation, and then another reminder 1 days before your slot. 

![[super-simple-signup-sheet.png]]

One checkbox on the creator form turns slots into categories with a write-in answer (aka Potluck Mode). "What are you bringing?"

![[super-simple-signup-potluck.png]]

Organizers get a page with every sheet they've made, reached by a link in their email. And an optional public page for the group, with a QR poster to print and tape up.

![[super-simple-signup-poster.png|width=500]]

### Under the hood

Astro on Vercel, Postgres on Neon, Resend for email. Plain HTML forms, no client framework. Sheets delete themselves 90 days after the event. Lightweight on purpose.

The name is literal, Super Simple Signup. SSS for short.  The logo mark is a snake: an S with an eye and a forked tongue. Human Crafted paper and ink, IBM Plex Sans, and wavy rules between the slots.
