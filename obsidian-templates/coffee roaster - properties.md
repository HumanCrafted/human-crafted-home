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
version: "1.0"
draft: false
---
## Coffees I've Tried

{% assign roaster_link = 'coffee-roaster-' | append: page.slug %}
{% assign roaster_coffees = site.docs | where_exp: "doc", "doc.tags contains 'coffee' and doc.roaster contains roaster_link" | sort: "date_tried" | reverse %}

{% if roaster_coffees.size > 0 %}
<div class="roaster-coffees">
  <table>
    <thead>
      <tr>
        <th>Coffee</th>
        <th>Origin</th>
        <th>Rating</th>
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
- Website: {{ website }}
{% if instagram %}- Instagram: [{{ instagram }}](https://instagram.com/{{ instagram | remove: "@" }}){% endif %}
- Featured in: [[]]