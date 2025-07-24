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
# Coffee Database

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
        <th>Rating</th>
        <th>Price</th>
        <th>Tried</th>
      </tr>
    </thead>
    <tbody>
      {% for coffee in coffee_docs %}
      <tr>
        <td>
          {% if coffee.image %}
            <img src="{{ coffee.image | relative_url }}" alt="{{ coffee.name }}" style="width: 50px; height: auto;">
          {% endif %}
        </td>
        <td><a href="{{ coffee.url | relative_url }}">{{ coffee.name }}</a></td>
        <td>{{ coffee.roaster }}</td>
        <td>{{ coffee.origin }}</td>
        <td>{{ coffee.rating }}/7</td>
        <td>{{ coffee.price }}</td>
        <td>{{ coffee.date_tried }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
{% else %}
<p><em>No coffee reviews found yet. Add some coffee documents with the 'coffee' tag to see them here!</em></p>
{% endif %}

## Rating System
- **7** - Exceptional, would buy again immediately
- **6** - Excellent, highly recommend  
- **5** - Very good, solid choice
- **4** - Good, decent coffee
- **3** - Okay, drinkable but nothing special
- **2** - Poor, wouldn't recommend
- **1** - Terrible, avoid

## Recent Coffee Notes

*Individual coffee reviews and detailed tasting notes appear below as I add them to the database.*
