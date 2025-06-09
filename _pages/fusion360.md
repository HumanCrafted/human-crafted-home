---
layout: default
title: Fusion360
permalink: /fusion360/
categories: [tools, cad, design]
tool_type: CAD design / engineering
---

# Fusion360

**Tool Type:** CAD design / engineering  
**Use Cases:** Product design, engineering, simulation, manufacturing prep

## Overview

Fusion360 is my primary CAD software for product design and engineering. It combines parametric modeling, simulation, and manufacturing tools in one integrated platform.

## Why I chose it

- **Integrated workflow** - Design, simulate, and prep for manufacturing in one tool
- **Cloud-based** - Access projects anywhere, automatic versioning
- **Affordable** - Much cheaper than traditional CAD suites
- **Manufacturing focus** - Built-in CAM for CNC, 3D printing support

## What I use it for

- Product concept development
- Technical drawings and documentation  
- 3D printing preparation
- CNC toolpath generation
- Design validation through simulation
- Assembly modeling and motion studies

## Projects

Here are some projects where Fusion360 was essential:

{% assign fusion_projects = site.projects | where_exp: "project", "project.content contains 'Fusion360' or project.content contains 'CAD'" %}
{% for project in fusion_projects limit: 6 %}
- [{{ project.title }}]({{ project.url }})
{% endfor %}

---

← [Back to More](/more/)