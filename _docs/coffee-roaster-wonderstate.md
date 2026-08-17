---
title: Wonderstate
location: Viroqua, WI 54665
founded: "2005"
website: https://wonderstate.com
instagram: "@wonderstatecoffee"
visited: false
visit_date:
notes: Certified B Corp. Formerly Kickapoo Coffee, rebranded to Wonderstate in 2020.
favorite_coffees:
tags:
  - coffee-roaster
layout: doc
slug: coffee-roaster-wonderstate
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
- Website: [https://wonderstate.com](https://wonderstate.com)

[^1]: Scale from 1-5, where 5 is excellent and 1 is terrible
