---
layout: doc
title: Services
slug: services
crumb: services
main_image:
featured: false
tags:
  - index
published_date: 2026-08-01
gallery_images:
version: "1.0"
draft: false
---
Need a little help (or a lot)?  Human Crafted is an [[about-me|experienced]] one-person studio, so the work is direct: you're talking to the person doing it. Most engagements start small, prove something out, and grow from there.

{% assign services = site.docs | where_exp: "doc", "doc.draft != true" | where_exp: "doc", "doc.tags contains 'services'" | sort: "weight" %}
{% if services.size > 0 %}
{% for service in services %}
### [{{ service.title }}]({{ service.url | relative_url }})

{% if service.summary %}{{ service.summary }}{% endif %}
{% endfor %}
{% else %}
*No services listed yet.*
{% endif %}

---

Not sure which one you need, or need something that isn't on the list? [[lab|Get in touch]] and we can talk it through.
