---
layout: doc
title: Places
slug: places
crumb: places
has_map: true
main_image:
featured: false
tags:
  - note
published_date: 2026-08-13
draft: false
---
A map of places for my own reference, but open to everyone. Starting with some "foodie" spots.

<div id="places-map" class="places-map" data-marker-path="{{ '/assets/js/lib/leaflet/images/' | relative_url }}"></div>

{% assign mapped = site.places | where_exp: "p", "p.lat" %}
