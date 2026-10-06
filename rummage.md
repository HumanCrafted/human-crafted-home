---
layout: default
title: Rummage
permalink: /rummage/
hide_title: true   # the breadcrumb wordmark (humancrafted.co/rummage) names the page
shop: true         # a shop page: cart icon shows while empty (default.html body class)
shop_page: true    # withheld entirely when shop_enabled is false
---
{%- comment -%}
  Old stock, retired products, offcuts and tools — the _rummage collection.
  Same grid and price pills as /made/, same cart and checkout, but its own
  page so leftovers don't sit among the products. Newest listing first.
  An item leaves the grid once every variant is at stock 0; setting
  `shop_status: off` removes its page too (shop_toggle.rb).
{%- endcomment -%}
{%- assign rummage_items = site.rummage | where: "shop_status", "available" | sort: "published_date" | reverse -%}
{%- assign rummage_count = 0 -%}
{%- for item in rummage_items -%}
  {%- for v in item.variants -%}{%- if v.stock > 0 -%}{%- assign rummage_count = rummage_count | plus: 1 -%}{%- break -%}{%- endif -%}{%- endfor -%}
{%- endfor -%}
{% if rummage_count > 0 %}
{% include project-grid.html items=rummage_items in_stock=true %}
{% else %}
<p class="made-empty">Nothing here right now.</p>{%- comment -%} PLACEHOLDER wording {%- endcomment -%}
{% endif %}
