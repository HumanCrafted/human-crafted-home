---
layout: doc
title: Materials
slug: materials
redirect_from:
  - /acrylic-colors/
  - /acrylic-aloe/
  - /acrylic-baby-blue/
  - /acrylic-black/
  - /acrylic-blue-fluorescent/
  - /acrylic-bronze-smoke-transparent/
  - /acrylic-brown-transparent/
  - /acrylic-burgundy-transparent/
  - /acrylic-dark-blue/
  - /acrylic-dark-blue-transparent/
  - /acrylic-dusk/
  - /acrylic-flakes-gold/
  - /acrylic-frosted-satin-ice/
  - /acrylic-funky-glitter-mistletoe/
  - /acrylic-glimmer-ash/
  - /acrylic-glitter-emerald/
  - /acrylic-gold-transparent/
  - /acrylic-green/
  - /acrylic-green-transparent/
  - /acrylic-ivory/
  - /acrylic-kelly-green/
  - /acrylic-khaki/
  - /acrylic-lemon-chiffon/
  - /acrylic-light-blue-transparent/
  - /acrylic-light-green-transparent/
  - /acrylic-lilac/
  - /acrylic-marshmallow/
  - /acrylic-mint-green-transparent/
  - /acrylic-olive/
  - /acrylic-peach/
  - /acrylic-pearl-cadmium/
  - /acrylic-persimmon/
  - /acrylic-pine/
  - /acrylic-red/
  - /acrylic-red-transparent/
  - /acrylic-rose-gold-transparent/
  - /acrylic-teal/
  - /acrylic-teal-transparent/
  - /acrylic-turquoise/
  - /acrylic-violet/
  - /acrylic-white/
  - /acrylic-wine/
  - /acrylic-wisteria/
main_image:
featured: false
tags:
  - note
published_date: 2026-08-26
gallery_images:
version: "1.0"
draft: false
---
Database of the materials things get made from — one note per color or stock, with a swatch, the vendor, and what it costs. Acrylic sheet for the [[laser-cutter|laser cutter]] so far; filament, fabric and wood get their own sections as they're catalogued. Prices are raw retail costs as last recorded.

## Acrylic

Grouped by vendor.

{% assign unsorted_colors = site.materials | where_exp: "doc", "doc.tags contains 'acrylic'" | where_exp: "doc", "doc.draft != true" %}
{% assign colors = "" | split: "" %}
{% assign vendor_groups = unsorted_colors | group_by: "vendor" | sort: "name" %}
{% for g in vendor_groups %}{% assign g_sorted = g.items | sort: "title" %}{% assign colors = colors | concat: g_sorted %}{% endfor %}

{% comment %} Collect unique palette names across all colors; blanks dropped.
Liquid 4 has no array push, so build a delimited string and split it. {% endcomment %}
{% assign palette_names = unsorted_colors | map: "palettes" | join: "," | split: "," | uniq | sort %}
{% assign palette_str = "" %}
{% for p in palette_names %}{% assign p_stripped = p | strip %}{% if p_stripped != "" %}{% assign palette_str = palette_str | append: p_stripped | append: "," %}{% endif %}{% endfor %}
{% assign palettes = palette_str | split: "," %}

{% if colors.size > 0 %}
<div class="acrylic-database">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Color</th>
        <th>Finish</th>
        <th>Sheet</th>
        <th>Price</th>
        <th>In inventory</th>
        <th>Vendor</th>
      </tr>
    </thead>
    <tbody>
      {% for color in colors %}
      <tr data-palettes="{% for p in color.palettes %}{{ p | slugify }}{% unless forloop.last %},{% endunless %}{% endfor %}">
        <td><img class="acrylic-swatch" src="{{ '/assets/images/' | append: color.image | relative_url }}" alt="{{ color.title }} acrylic swatch" loading="lazy"></td>
        <td>{{ color.title }}</td>
        <td>{{ color.finish }}</td>
        <td>{{ color.sheet_size }}</td>
        <td>${{ color.price }}</td>
        <td>{% if color.in_inventory %}yes{% endif %}</td>
        <td>
          {% if color.purchase_url %}
            <a href="{{ color.purchase_url }}">{{ color.vendor }}</a>
          {% else %}
            {{ color.vendor }}
          {% endif %}
        </td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
{% else %}
<p><em>No colors catalogued yet. Add a note to _materials/ with the 'acrylic' tag to see it here.</em></p>
{% endif %}

{% if palettes.size > 0 %}
<div class="tag-filters">
  <button class="tag-filter active" data-filter="all">all</button>
  {% for palette in palettes %}
    <button class="tag-filter" data-filter="{{ palette | strip | slugify }}">{{ palette | strip }}</button>
  {% endfor %}
</div>

<script>
// Palette filtering — same pattern as the homepage project grid (index.md).
document.addEventListener('DOMContentLoaded', function() {
  const filters = document.querySelectorAll('.tag-filter');
  const rows = document.querySelectorAll('.acrylic-database tbody tr');

  function applyFilter(filterValue) {
    filters.forEach(f => f.classList.remove('active'));
    const activeFilter = document.querySelector(`[data-filter="${filterValue}"]`);
    if (activeFilter) {
      activeFilter.classList.add('active');
    }

    rows.forEach(row => {
      if (filterValue === 'all') {
        row.style.display = '';
      } else {
        const rowPalettes = row.dataset.palettes.split(',');
        row.style.display = rowPalettes.includes(filterValue) ? '' : 'none';
      }
    });

    // Keep the address bar in sync so a filtered view can be shared by
    // copying the URL.
    const url = new URL(window.location);
    if (filterValue === 'all') {
      url.searchParams.delete('palette');
    } else {
      url.searchParams.set('palette', filterValue);
    }
    history.replaceState(null, '', url);
  }

  // Palette values in the DOM and the URL are slugs (Liquid's slugify).
  // Slugify the incoming param the same way so older links that carried the
  // display name ("?palette=2025%20Good%20Day%20Shop") keep working.
  const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const urlParams = new URLSearchParams(window.location.search);
  const paletteParam = urlParams.get('palette');
  if (paletteParam) {
    applyFilter(slugify(paletteParam));
  }

  filters.forEach(filter => {
    filter.addEventListener('click', function() {
      applyFilter(this.dataset.filter);
    });
  });
});
</script>
{% endif %}
