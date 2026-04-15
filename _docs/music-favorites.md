---
layout: doc
title: Favorite Tracks
slug: music-favorites
main_image:
featured: false
tags:
  - note
published_date: 2026-04-14
draft: false
---

A running list of tracks that have stuck — ambient, electronic, and otherwise. Maintained here so it lives outside Apple Music.

{% assign tracks = site.music | sort: "artist" %}
{% if tracks.size > 0 %}
<table class="music-table">
  <thead>
    <tr>
      <th>Title</th>
      <th>Artist</th>
      <th>Album</th>
      <th>Year</th>
    </tr>
  </thead>
  <tbody>
    {% for track in tracks %}
    <tr>
      <td>{{ track.title }}</td>
      <td>{{ track.artist }}</td>
      <td>{{ track.album }}</td>
      <td>{{ track.year }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
{% endif %}
