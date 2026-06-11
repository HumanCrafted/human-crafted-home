---
layout: doc
title: Socials
slug: socials
main_image:
featured: false
tags:
  - note
published_date: 2026-06-10
gallery_images:
version: "1.0"
draft: false
---

Where to find me around the web.

{% for social in site.data.social %}{% if social.enabled %}- [{{ social.name | replace: 'X-Twitter', 'Twitter' }}]({{ social.url }})
{% endif %}{% endfor %}
