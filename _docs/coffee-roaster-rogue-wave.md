---
name: Rogue Wave
location: 1322 119 St NWEdmonton, Alberta, CanadaT5G 2X4
founded: ""
website: https://roguewavecoffee.ca
instagram: "@rogue_wave_coffee"
visited: false
visit_date: 
notes: 
favorite_coffees: 
tags:
  - coffee-roaster
layout: doc
slug: rogue-wave
main_image: "![](../assets/images/rw-logo-horizontal-black-RGB_1caf9b21-e328-4ecd-9397-a4249f440449.png)"
version: "1"
draft: false
---

## Coffees I've Tried

{% assign roaster_coffees = site.docs | where_exp: "doc", "doc.tags contains 'coffee' and doc.roaster == page.name" | sort: "date_tried" | reverse %}

{% if roaster_coffees.size > 0 %}
<div class="roaster-coffees">
  <table>
    <thead>
      <tr>
        <th>Coffee</th>
        <th>Origin</th>
        <th>Rating</th>
        <th>Date Tried</th>
      </tr>
    </thead>
    <tbody>
      {% for coffee in roaster_coffees %}
      <tr>
        <td><a href="{{ coffee.url | relative_url }}">{{ coffee.name }}</a></td>
        <td>{{ coffee.origin }}</td>
        <td>{{ coffee.rating_1-5 }}/7</td>
        <td>{{ coffee.date_purchased }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
{% else %}
<p><em>No coffees from this roaster in the database yet.</em></p>
{% endif %}

## Links
- Website: https://roguewavecoffee.ca