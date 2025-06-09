---
layout: default
title: Tools
permalink: /tools/
categories:
  - index
---

This is a collection of all the tools and software I use in my design and fabrication process.

### Design & Engineering Tools

{% assign tool_pages = site.pages | where_exp: "page", "page.categories contains 'tools'" %}
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