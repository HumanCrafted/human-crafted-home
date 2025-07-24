---
name: Roaster Name
location: City, State/Country
founded: ""
website: https://roasterwebsite.com
instagram: "@roasterhandle"
visited: false
visit_date: 
notes: ""
favorite_coffees: 
tags:
  - coffee-roaster
layout: doc
slug: 
main_image: roaster-logo.jpg
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
- Website: {{ website }}
{% if instagram %}- Instagram: [{{ instagram }}](https://instagram.com/{{ instagram | remove: "@" }}){% endif %}
- Featured in: [[]]