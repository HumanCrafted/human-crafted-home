---
layout: doc
title: Tooling
slug: tooling
main_image:
featured: false
tags:
  - tools
published_date: 2026-08-23
gallery_images:
version: "1.0"
draft: false
---
Database of cutting tooling for the [[cnc-router|CNC router]] — what it is, where it came from, and the feeds and speeds to run it at. For local reference, each bit is marked in sharpie with the ID in the first column. The letter is the geometry: **U**pcut, **D**owncut, **C**ompression, **V**-bit, **B**allnose, **S**traight.

{% assign bits = site.docs | where_exp: "doc", "doc.tags contains 'bit'" | where_exp: "doc", "doc.draft != true" | sort: "cutting_diameter" %}

{% if bits.size > 0 %}
<div class="tooling-database">
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Tool</th>
        <th>Geometry</th>
        <th markdown="span">Dia[^1]</th>
        <th>Flutes</th>
        <th>LOC</th>
        <th>Best for</th>
        <th>Vendor</th>
      </tr>
    </thead>
    <tbody>
      {% for bit in bits %}
      <tr>
        <td>{{ bit.serial }}</td>
        <td><a href="{{ bit.url | relative_url }}">{{ bit.title }}</a></td>
        <td>{{ bit.geometry }}</td>
        <td>{{ bit.cutting_diameter }}</td>
        <td>{{ bit.flutes }}</td>
        <td>{{ bit.cutting_length }}</td>
        <td>{{ bit.best_for }}</td>
        <td>
          {% if bit.purchase_url %}
            <a href="{{ bit.purchase_url }}">{{ bit.vendor }}</a>
          {% else %}
            {{ bit.vendor }}
          {% endif %}
        </td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
{% else %}
<p><em>No bits catalogued yet. Add a document with the 'bit' tag to see it here.</em></p>
{% endif %}

[^1]: Cutting diameter in inches. Shank diameter and overall length are on each bit's own page.
