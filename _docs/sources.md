---
layout: doc
title: Sources
slug: sources
main_image:
featured: false
tags:
  - note
published_date: 2026-10-20
gallery_images:
version: "1.0"
draft: false
---
Where the parts and packaging for our products come from, plus a few shop supplies. Sheet stock and filament are on [[materials|Materials]].

{% comment %} Rows come from _data/sources.yml, which script/sources.py writes
from the CoOps supply notes (only the ones marked `site: true`). Edit CoOps and
rerun the script; don't edit the data file. Thumbnails are toned ink-to-paper
by the script, so they melt into the light page and sit on a paper tile in dark
mode. {% endcomment %}

<div class="materials-database">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Supply</th>
        <th>Item</th>
        <th>Part</th>
        <th>Vendor</th>
      </tr>
    </thead>
    <tbody>
      {% for source in site.data.sources %}
      {% for it in source.items %}
      {%- assign thumb = it.image | default: source.image %}
      <tr>
        <td>{% if thumb %}<img class="source-thumb" src="{{ '/assets/images/' | append: thumb | relative_url }}" alt="{{ source.name | escape }}, {{ it.item | escape }}" loading="lazy">{% endif %}</td>
        <td>{{ source.name }}</td>
        <td>{{ it.item }}</td>
        <td>{{ it.part }}</td>
        <td>{% if it.url %}<a href="{{ it.url }}">{{ it.vendor }}</a>{% else %}{{ it.vendor }}{% endif %}</td>
      </tr>
      {% endfor %}
      {% endfor %}
    </tbody>
  </table>
</div>
