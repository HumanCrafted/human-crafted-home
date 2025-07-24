---
layout: doc
title: Coffee
slug: coffee
main_image: 
featured: false
tags:
  - note
published_date: 2025-07-21
gallery_images: 
version: "1"
draft: false
---
A collection of coffee beans I've tried, rated, and reviewed.

{% assign coffee_docs = site.docs | where_exp: "doc", "doc.tags contains 'coffee'" | sort: "date_tried" | reverse %}

{% if coffee_docs.size > 0 %}
<div class="coffee-database">
  <table>
    <thead>
      <tr>
        <th>Bag</th>
        <th>Coffee</th>
        <th>Roaster</th>
        <th>Origin</th>
        <th>Roasted</th>
        <th>Rating</th>
      </tr>
    </thead>
    <tbody>
      {% for coffee in coffee_docs %}
      <tr>
        <td>
          {% if coffee.coffee_bag_image %}
            {% assign image_filename = coffee.coffee_bag_image | replace: '![](', '' | replace: ')', '' | replace: '../assets/images/', '' %}
            <img src="{{ '/assets/images/' | append: image_filename | relative_url }}" alt="{{ coffee.name }}" style="width: 50px; height: auto;">
          {% endif %}
        </td>
        <td><a href="{{ coffee.url | relative_url }}">{{ coffee.name }}</a></td>
        <td>
          {% assign roaster_page = site.docs | where_exp: "doc", "doc.tags contains 'coffee-roaster' and doc.name == coffee.roaster" | first %}
          {% if roaster_page %}
            <a href="{{ roaster_page.url | relative_url }}">{{ coffee.roaster }}</a>
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

## Rating System
- **5** - Excellent, highly recommend  
- **4** - Very good, solid choice
- **3** - Okay
- **2** - Poor, wouldn't recommend
- **1** - Terrible, avoid


