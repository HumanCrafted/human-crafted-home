---
layout: default
title: Manufacturing
permalink: /manufacturing/
categories:
  - index
---

Tools and projects related to manufacturing processes and production.

### Manufacturing Tools

{% assign manufacturing_pages = site.pages | where_exp: "page", "page.categories contains 'manufacturing'" %}
{% for page in manufacturing_pages %}
{% unless page.title == "Manufacturing" %}
- **[{{ page.title }}]({{ page.url | relative_url }})** - {{ page.tool_type | default: "Tool" }}
  {% if page.specs %}<br>*{{ page.specs }}*{% endif %}
{% endunless %}
{% endfor %}

### Manufacturing Projects

{% assign manufacturing_projects = site.projects | where_exp: "project", "project.categories contains 'manufacturing'" %}
{% if manufacturing_projects.size > 0 %}
{% for project in manufacturing_projects %}
- **[{{ project.title }}]({{ project.url | relative_url }})** - {{ project.description | default: "Project" }}
{% endfor %}
{% else %}
*No manufacturing-related projects found.*
{% endif %}

---