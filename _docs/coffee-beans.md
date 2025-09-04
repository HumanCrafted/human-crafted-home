---
layout: doc
title: Coffee Beans
slug: coffee-beans
main_image: 
featured: false
tags:
  - note
published_date: 2025-07-21
gallery_images: 
version: "1.0"
draft: false
---
A collection of coffee beans I've tried, rated, and reviewed. Each coffee is rated on a scale[^1] based on taste, quality, and overall experience.

{% assign coffee_docs = site.docs | where_exp: "doc", "doc.tags contains 'coffee'" | sort: "date_tried" | reverse %}

{% if coffee_docs.size > 0 %}
<div class="coffee-database">
  <table markdown="1">
    <thead>
      <tr>
        <th>Bag</th>
        <th>Coffee</th>
        <th>Roaster</th>
        <th>Origin</th>
        <th>Roasted</th>
        <th markdown="span">Rating[^1]</th>
      </tr>
    </thead>
    <tbody>
      {% for coffee in coffee_docs %}
      <tr>
        <td>
          {% if coffee.image %}
            {% assign image_filename = coffee.image | replace: '![[', '' | replace: ']]', '' %}
            <img src="{{ '/assets/images/' | append: image_filename | relative_url }}" alt="{{ coffee.name }}" style="width: 50px; height: auto;">
          {% endif %}
        </td>
        <td><a href="{{ coffee.url | relative_url }}">{{ coffee.name }}</a></td>
        <td>
          {% if coffee.roaster contains '[[' %}
            {% assign roaster_parts = coffee.roaster | replace: '[[', '' | replace: ']]', '' | split: '|' %}
            {% assign roaster_link = roaster_parts[0] %}
            {% if roaster_parts[1] %}
              {% assign roaster_display = roaster_parts[1] %}
            {% else %}
              {% assign roaster_display = roaster_link | replace: 'coffee-roaster-', '' %}
            {% endif %}
            {% assign roaster_slug = roaster_link | replace: 'coffee-roaster-', '' %}
            {% assign roaster_page = site.docs | where: "slug", roaster_slug | first %}
            {% if roaster_page %}
              <a href="{{ roaster_page.url | relative_url }}">{{ roaster_display }}</a>
            {% else %}
              {{ roaster_display }}
            {% endif %}
          {% else %}
            {{ coffee.roaster }}
          {% endif %}
        </td>
        <td>{{ coffee.origin }}</td>
        <td>{{ coffee.date_roasted }}</td>
        <td>{{ coffee.rating_1-5 }}/5</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
{% else %}
<p><em>No coffee reviews found yet. Add some coffee documents with the 'coffee' tag to see them here!</em></p>
{% endif %}


[^1]: Scale from 1-5, where 5 is excellent and 1 is terrible
