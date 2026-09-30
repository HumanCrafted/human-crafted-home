---
layout: project
title: Super Simple Signup
slug: super-simple-signup
main_image: "![[super-simple-signup-logo.svg]]"
featured: false
categories:
  - code
published_date:
draft: true
gallery_images:
headline: "A signup sheet in one link. No accounts, nothing to pay for."
version: "1.0"
tools:
  - claude
process:
---

[Super Simple Signup](https://supersimplesignup.com) is a signup sheet in one link. Make a sheet, share it, people pick a slot. Everyone gets a confirmation and a reminder the day before. No accounts, nothing to install, and free.

Every school event needs one: concession shifts, setup crews, who's bringing what. I wanted the simplest possible version of SignUpGenius. Built with Claude over September. Version 1.0 was live on day one, and the rest of the month was filling in.

![[super-simple-signup-home.png]]

### No accounts

Nobody signs in. The organizer fills out one form and gets an email with a confirm link. That link opens the manage page, and the manage page is the only admin there is. Bookmark it. Everyone who signs up gets their own link to change or cancel. Having the link is the permission, the same way Doodle works.

![[super-simple-signup-manage.png]]

### Signing up

Pick as many slots as you like, type your name and email once, get one email. Most people will open the sheet from a group text, so the phone is the layout that matters.

![[super-simple-signup-sheet.png]]

![[super-simple-signup-phone.png|width=390]]

One checkbox on the create form turns slots into categories with a write-in answer (aka Potluck Mode). "What are you bringing?"

![[super-simple-signup-potluck.png]]

Organizers get a page with every sheet they've made, reached by a link in their email. And an optional public page for the group, with a QR poster to print and tape up.

![[super-simple-signup-poster.png|width=500]]

### Under the hood

Astro on Vercel, Postgres on Neon, Resend for email. Plain HTML forms, no client framework. The one hard problem is two people grabbing the last spot at the same time. The claim is a single SQL insert that only succeeds if there's room, so exactly one of them wins. Sheets delete themselves 90 days after the event. It all runs on free tiers until real volume shows up.

The name is literal. SSSS for short, so the mark is a snake: an S with an eye and a forked tongue. One hiss per screen, only where nothing is at stake ("Make a ssssheet"). Human Crafted paper and ink, IBM Plex Sans, and wavy rules between the slots.
