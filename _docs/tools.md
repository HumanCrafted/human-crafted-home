---
layout: doc
title: Tools
slug: tools
main_image: 
featured: false
tags:
  - index
published_date: 
gallery_images: 
version: 
draft: false
---
This is a collection of all the tools and software I use in my design and fabrication process.

| **Type**                              | **Spec**                                                        |
| ------------------------------------- | --------------------------------------------------------------- |
| [Laser Cutter]({{ "/laser-cutter/" | relative_url }}) | 1300mm x 900mm 150 Watt CO2                                     |
| CNC Router                            | 24 in x 48 in X-Carve Pro                                       |
| Digital mockups                       | Figma, Illustrator,                                             |
| Web design                            | Static Page Sites, Framer, Notion + Super, Webflow, Squarespace |
| 3D Printer                            | 7 in x 7 in x 7 in, Prusa MINI+                                 |
| CAD Design                            | [Fusion360]({{ "/fusion360/" | relative_url }})                                 |
| Electronics mockups                   | Arduino, Raspberry Pi, IoT                                      |
| Organization                          | Notion, Airtable, Mural, Figjam                                 |
| Business Operations                   | Toggl, Xero, Ramp, Tally.so                                     |
| AI Tools                              | ChatGPT, Vercel v0, GitHub Co-Pilot                             |

---


### Design & Engineering Tools

{% assign tool_pages = site.pages | where_exp: "page", "page.tag contains 'tools'" %}
{% for page in tool_pages %}
{% unless page.title == "Tools" %}
- **[{{ page.title }}]({{ page.url | relative_url }})** - {{ page.tool_type | default: "Tool" }}
  {% if page.specs %}<br>*{{ page.specs }}*{% endif %}
{% endunless %}
{% endfor %}

### Project Tools

{% assign tool_projects = site.projects | where_exp: "project", "project.categories contains 'tools'" %}
{% if tool_projects.size > 0 %}
{% for project in tool_projects %}
- **[{{ project.title }}]({{ project.url | relative_url }})** - {{ project.description | default: "Project" }}
{% endfor %}
{% else %}
*No tool-related projects found.*
{% endif %}

---