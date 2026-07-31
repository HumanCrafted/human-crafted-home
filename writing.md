---
layout: default
title: Writings.
permalink: /writing/
---

A collection of thoughts, insights, and reflections on design, engineering, and the creative process.

---

{% assign published_posts = site.posts | where_exp: "post", "post.draft != true" %}
{% for post in published_posts %}
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

{% if published_posts.size == 0 %}
  <p>No posts yet. Check back soon!</p>
{% endif %}