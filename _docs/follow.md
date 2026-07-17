---
layout: doc
title: Follow
slug: follow
redirect_from:
  - /socials/
main_image:
featured: false
tags:
  - about
published_date: 2026-06-10
gallery_images:
version: "1.0"
draft: false
---

Where to find me around the web.

{% for social in site.data.social %}{% if social.enabled %}- [{{ social.name | replace: 'X-Twitter', 'Twitter' }}]({{ social.url }})
{% endif %}{% endfor %}

Or skip the feeds for an occasional email when I make something new.

{% include subscribe-form.html %}
