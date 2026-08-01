---
layout: doc
title: Notes
slug: notes
crumb: notes
main_image:
featured: false
tags:
  - index
published_date: 2026-08-01
gallery_images:
version: "1.0"
draft: false
---
Working notes and reference lists. They're here if they're useful. Continually updating and expanding. Wish I documented something about me or my processes/tools?  [[lab|Reach out]] and let me know what you would like to see.

{% assign notes = site.docs | where_exp: "doc", "doc.draft != true" | where_exp: "doc", "doc.tags contains 'note'" | sort: "title" %}
{% if notes.size > 0 %}
{% for note in notes %}
- [{{ note.title }}]({{ note.url | relative_url }}){% if note.summary %} — {{ note.summary }}{% endif %}
{% endfor %}
{% else %}
*No notes yet.*
{% endif %}
