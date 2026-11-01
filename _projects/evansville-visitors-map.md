---
layout: project
title: Evansville Visitors Map
slug: evansville-visitors-map
main_image: "![[evansville-visitors-map-thumbnail.svg]]"
featured: false
categories:
  - client work
published_date: 2026-09-15
draft: false
gallery_images:
headline: Visit Evansville on one 11×17 sheet.
version: "1.0"
tools:
  - claude
  - figma
process:
---

I live in the small town of Evansville, WI and sit on the Economic Development Committee. Earlier this year we discussed having tear-off maps of the city and its businesses at spots around the city for visitors to use. A few of us had seen or used others' examples of this kind of map in cities we had visited. I offered my time to design and develop a map for the town.

![[evansville-visitors-map.png]]

### Drawn from real data

I used Claude.ai to pull roads, creeks, lakes, parks, woods, the railroad and the city limits from OpenStreetMap, and build them as editable vectors in Figma. I developed the layout and design system, and then again had Claude make adjustments to the map to follow those guidelines. I also had Claude help organize the list of businesses to be included. Each landmark and numbered location marker was placed by hand. The icons are from Mapbox's open-source Maki and Temaki sets.

![[evansville-visitors-map-lake-leota.png]]

The downtown is too dense for the main map, so it has its own inset at about 4× scale. It's a copy of the main map's layers, so the two can't drift apart.

![[evansville-visitors-map-downtown.png]]

### Keeping it current

Businesses open and close. The map lives in Figma, and a small repo keeps a numbered list of every business to match the legend, plus a changelog for each release. Version 1.0 went to the printer on September 15, 2026.

Map data © OpenStreetMap contributors.
