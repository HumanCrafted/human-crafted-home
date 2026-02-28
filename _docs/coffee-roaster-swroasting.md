---
name: S&W Craft Roasting
location: 196 Lincoln Hls, Coatesville, IN 46121
founded:
website: https://www.swroasting.coffee
instagram: "@swroasting"
visited: false
visit_date:
notes:
favorite_coffees:
tags:
  - coffee-roaster
layout: doc
slug: coffee-roaster-swroasting
version: "1.0"
draft: false
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
        <td><a href="{{ coffee.url | relative_url }}">{{ coffee.name }}</a></td>
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
- Website: [https://www.swroasting.coffee](https://www.swroasting.coffee)

[^1]: Scale from 1-5, where 5 is excellent and 1 is terrible
