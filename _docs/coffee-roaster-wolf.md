---
title: Wolf Coffee Roasters
location: 44 Buckingham Street, Arrowtown 9302, New Zealand
founded: ""
website: https://wolfcoffee.co.nz
instagram: "@wolfcoffeeroasters"
visited: false
visit_date:
notes: ""
favorite_coffees:
tags:
  - coffee-roaster
layout: doc
slug: coffee-roaster-wolf
version: "1.0"
draft: false
featured: false
---

## Coffees I've Tried

{% assign roaster_coffees = site.docs | where_exp: "doc", "doc.tags contains 'coffee' and doc.roaster contains page.slug" | sort: "date_tried" | reverse %}

{% if roaster_coffees.size > 0 %}
<div class="roaster-coffees">
  <table>
    <thead>
      <tr>
        <th>Coffee</th>
        <th>Origin</th>
        <th markdown="span">Rating[^1]</th>
      </tr>
    </thead>
    <tbody>
      {% for coffee in roaster_coffees %}
      <tr>
        <td><a href="{{ coffee.url | relative_url }}">{{ coffee.title }}</a></td>
        <td>{{ coffee.origin }}</td>
        <td>{{ coffee.rating_1-5 }}/5</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
{% else %}
<p><em>No coffees from this roaster in the database yet.</em></p>
{% endif %}

## Links
- Website: [https://wolfcoffee.co.nz](https://wolfcoffee.co.nz)
- Instagram: [@wolfcoffeeroasters](https://instagram.com/wolfcoffeeroasters)

[^1]: Scale from 1-5, where 5 is excellent and 1 is terrible
