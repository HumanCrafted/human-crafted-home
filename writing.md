---
layout: default
title: Writing
permalink: /writing/
---

A collection of thoughts, insights, and reflections on design, engineering, and the creative process.

---

{% for post in site.posts %}
  <div class="post-item">
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <p class="post-meta">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %-d, %Y" }}</time>
      {% if post.categories.size > 0 %}
        • {% for category in post.categories %}{{ category }}{% unless forloop.last %}, {% endunless %}{% endfor %}
      {% endif %}
    </p>
    {% if post.excerpt %}
      <p>{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
    {% endif %}
  </div>
{% endfor %}

{% if site.posts.size == 0 %}
  <p>No posts yet. Check back soon!</p>
{% endif %}