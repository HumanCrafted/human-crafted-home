---
layout: default
title: Fabrication
permalink: /fabrication/
tag:
  - index
---

Tools and projects related to physical fabrication and making.

### Fabrication Tools

{% assign fabrication_pages = site.pages | where_exp: "page", "page.tag contains 'fabrication'" %}
{% for page in fabrication_pages %}
{% unless page.title == "Fabrication" %}
- **[{{ page.title }}]({{ page.url | relative_url }})** - {{ page.tool_type | default: "Tool" }}
  {% if page.specs %}<br>*{{ page.specs }}*{% endif %}
{% endunless %}
{% endfor %}

### Fabrication Projects

{% assign fabrication_projects = site.projects | where_exp: "project", "project.categories contains 'fabrication'" %}
{% if fabrication_projects.size > 0 %}
{% for project in fabrication_projects %}
- **[{{ project.title }}]({{ project.url | relative_url }})** - {{ project.description | default: "Project" }}
{% endfor %}
{% else %}
*No fabrication-related projects found.*
{% endif %}

---