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
A map of places for my own reference, but open to everyone. Starting with some foodie[^1] spots.

<div id="places-map" class="places-map" data-marker-path="{{ '/assets/js/lib/leaflet/images/' | relative_url }}"></div>

{% assign mapped = site.places | where_exp: "p", "p.lat" %}

[^1]: [Wisconsin Foodie](https://www.wisconsinfoodie.com) is PBS Wisconsin's long-running food and travel series — Luke Zahm hosting since 2020, Kyle Cherek before him — visiting a different restaurant, farm, or producer most episodes; this map currently covers the show's last decade, seasons 6 through 16. [Top Chef](https://www.bravotv.com/top-chef) is Bravo's culinary competition series, pitting professional chefs against each other since 2006; this map plots the current or best-known restaurant of a contestant from each of the show's 22 U.S. seasons.
