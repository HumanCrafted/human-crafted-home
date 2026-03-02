---
layout: doc
title: 3D Printer
slug: 3d-printer
main_image:
featured: false
tags:
  - tools
published_date: 2025-06-12
gallery_images:
version:
draft: false
---
**Specs:** 7" x 7" x 7" build volume, Prusa MINI+
**Materials:** PLA, PETG, ABS

### Capabilities

- **Rapid prototyping** - Quick turnaround on functional test parts
- **Functional parts** - Clips, brackets, housings, and custom fixtures
- **Small batch production** - Short runs of final or near-final parts
- **Complex geometry** - Shapes that would be difficult or impossible to machine

### Materials I work with

- **PLA** - General prototyping, dimensional models, low-stress parts. Matte appearance.
- **PETG** - Stronger parts, better heat resistance, food-safe applications. Glossy appearance.
- **ABS** - Durable, impact-resistant parts with good heat tolerance. Appropriate for PVC cement bonding.

### Process

1. **Design** in Fusion 360
2. **Slice** and optimize print settings in PrusaSlicer
3. **Print** with tuned parameters for the material
4. **Finishing** - support removal, sanding, assembly

### Recent Projects

{% assign printer_projects = site.projects | where_exp: "project", "project.tools contains '3d-printer'" | sort: "published_date" | reverse %}
{% for project in printer_projects limit: 8 %}
- [{{ project.title }}]({{ project.url | relative_url }})
{% endfor %}

---
