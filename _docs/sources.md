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
rerun the script; don't edit the data file. Used for links each product slug to
its project page (or, for shop gear, a note such as 3d-printer), and leaves out
a slug with no published page. {% endcomment %}
{% assign live = site.projects | concat: site.docs | where_exp: "doc", "doc.draft != true" %}

<div class="materials-database">
  <table>
    <thead>
      <tr>
        <th>Supply</th>
        <th>Item</th>
        <th>Part</th>
        <th>Vendor</th>
        <th>Used for</th>
      </tr>
    </thead>
    <tbody>
      {% for source in site.data.sources %}
      {% for it in source.items %}
      <tr>
        <td>{% if forloop.first %}{{ source.name }}{% endif %}</td>
        <td>{{ it.item }}</td>
        <td>{{ it.part }}</td>
        <td>{% if it.url %}<a href="{{ it.url }}">{{ it.vendor }}</a>{% else %}{{ it.vendor }}{% endif %}</td>
        <td>
          {%- if forloop.first -%}
          {%- assign shown = 0 -%}
          {%- for slug in source.used_for -%}
            {%- assign product = live | where: "slug", slug | first -%}
            {%- if product -%}{%- if shown > 0 %}, {% endif -%}<a href="{{ product.url | relative_url }}">{{ product.title }}</a>{%- assign shown = shown | plus: 1 -%}{%- endif -%}
          {%- endfor -%}
          {%- endif -%}
        </td>
      </tr>
      {% endfor %}
      {% endfor %}
    </tbody>
  </table>
</div>
