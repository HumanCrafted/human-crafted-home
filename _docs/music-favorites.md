---
layout: doc
title: Music
slug: music
main_image:
featured: false
tags:
  - note
published_date: 2026-04-14
draft: false
version: "1.0"
has_audio: true
---

A running list of tracks that have stuck — ambient, electronic, and otherwise. Maintained here so it lives outside Apple Music. Preview the song with the play button.

{% assign tracks = site.music | where_exp: "item", "item.artist != nil" %}
{% comment %}
  Newest release first. Grouping by year and reversing gives a stable secondary
  sort by artist — chaining two `sort` filters would not, since Liquid's sort is
  not stable. Tracks with no year fall to the bottom (empty group name sorts first).
{% endcomment %}
{% assign years = tracks | group_by: "year" | sort: "name" | reverse %}
{% if tracks.size > 0 %}
<table class="music-table">
  <thead>
    <tr>
      <th>Title</th>
      <th>Artist</th>
      <th>Album</th>
      <th>Year</th>
      <th>Genre</th>
    </tr>
  </thead>
  <tbody>
    {% for year in years %}
    {% assign year_tracks = year.items | sort_natural: "artist" %}
    {% for track in year_tracks %}
    <tr>
      <td class="track-title">{% if track.preview_url %}<button type="button" class="track-play" data-preview="{{ track.preview_url }}" aria-label="Play a preview of {{ track.title | escape }}" data-umami-event="Track preview" data-umami-event-track="{{ track.title | escape }}"></button>{% endif %}{% if track.apple_music_url %}<a href="{{ track.apple_music_url }}" rel="noopener">{{ track.title }}</a>{% else %}{{ track.title }}{% endif %}</td>
      <td>{{ track.artist }}</td>
      <td>{{ track.album }}</td>
      <td>{{ track.year }}</td>
      <td>{{ track.genre }}</td>
    </tr>
    {% endfor %}
    {% endfor %}
  </tbody>
</table>
{% endif %}
