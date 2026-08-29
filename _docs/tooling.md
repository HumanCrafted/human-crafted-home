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
Database of cutting tooling — what it is, where it came from, and how to run it. CNC bits first, hand router bits, then drill bits. For local reference, each bit is marked in sharpie with the ID in the first column.

## CNC router

Bits for the [[cnc-router|X-Carve Pro]], each with feeds and speeds matching its presets in the Fusion hub library. The letter is the geometry: **U**pcut, **D**owncut, **C**ompression, **V**-bit, **B**allnose, **S**traight, **R**oundover.

{% assign unsorted_bits = site.docs | where_exp: "doc", "doc.tags contains 'bit'" | where_exp: "doc", "doc.draft != true" %}
{% assign bits = "" | split: "" %}
{% assign dia_groups = unsorted_bits | group_by: "cutting_diameter" | sort: "name" %}
{% for g in dia_groups %}{% assign g_sorted = g.items | sort: "serial" %}{% assign bits = bits | concat: g_sorted %}{% endfor %}

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

## Hand router

Profile bits for the handheld router. One series, **H**, numbered in the order they arrive — the profile is right there to see, so the letter doesn't need to encode it. No Fusion entries and no feed tables; these run by ear.

{% assign rbits = site.docs | where_exp: "doc", "doc.tags contains 'router-bit'" | where_exp: "doc", "doc.draft != true" | sort: "serial" %}

{% if rbits.size > 0 %}
<div class="tooling-database">
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Bit</th>
        <th>Profile</th>
        <th>Radius</th>
        <th markdown="span">Dia[^2]</th>
        <th>Shank</th>
        <th>Bearing</th>
        <th>Best for</th>
        <th>Vendor</th>
      </tr>
    </thead>
    <tbody>
      {% for bit in rbits %}
      <tr>
        <td>{{ bit.serial }}</td>
        <td><a href="{{ bit.url | relative_url }}">{{ bit.title }}</a></td>
        <td>{{ bit.profile }}</td>
        <td>{{ bit.radius }}</td>
        <td>{{ bit.cutting_diameter }}</td>
        <td>{{ bit.shank_diameter }}</td>
        <td>{{ bit.bearing }}</td>
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
<p><em>No router bits catalogued yet. Add a document with the 'router-bit' tag to see it here.</em></p>
{% endif %}

## Drill bits

Twist bits for the drill press and cordless drill — a different machine and a different geometry from anything above, so they get their own series rather than stretching the CNC letters or the router-bit series to cover them. One flat series, **T**, numbered in the order they arrive.

{% assign dbits = site.docs | where_exp: "doc", "doc.tags contains 'drill-bit'" | where_exp: "doc", "doc.draft != true" | sort: "serial" %}

{% if dbits.size > 0 %}
<div class="tooling-database">
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Bit</th>
        <th>Size</th>
        <th>Point</th>
        <th>Length Class</th>
        <th>OAL</th>
        <th>Best for</th>
        <th>Vendor</th>
      </tr>
    </thead>
    <tbody>
      {% for bit in dbits %}
      <tr>
        <td>{{ bit.serial }}</td>
        <td><a href="{{ bit.url | relative_url }}">{{ bit.title }}</a></td>
        <td>{{ bit.bit_size }}</td>
        <td>{{ bit.point_type }}</td>
        <td>{{ bit.length_class }}</td>
        <td>{{ bit.overall_length }}</td>
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
<p><em>No drill bits catalogued yet. Add a document with the 'drill-bit' tag to see it here.</em></p>
{% endif %}

[^1]: Cutting diameter in inches. Shank diameter and overall length are on each bit's own page.
[^2]: Large diameter in inches.
