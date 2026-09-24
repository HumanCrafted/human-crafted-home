---
layout: default
title: Made
permalink: /made/
hide_title: true   # the breadcrumb wordmark (humancrafted.co/made) names the page
shop: true         # a shop page: cart icon shows while empty (default.html body class)
shop_page: true    # withheld entirely when shop_enabled is false
---
{%- comment -%}
  The things for sale, reached from the Made pill in the nav. Deliberately the
  homepage grid and nothing else — no hero, no filter bar — so it looks exactly
  like the homepage with only the Made projects showing. The homepage's own
  Made filter stays: there, Made products read as part of the whole body of
  work.
{%- endcomment -%}
{%- assign made_count = site.projects | where: "shop_status", "available" | where: "draft", false | size -%}
{% if made_count > 0 %}
{% include project-grid.html made=true %}
{% else %}
<p class="made-empty">Nothing available right now.</p>{%- comment -%} PLACEHOLDER wording {%- endcomment -%}
{% endif %}
