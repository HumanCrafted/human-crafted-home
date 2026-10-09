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
version: "1.0"
draft: false
---
**Printers:** Bambu Lab X2D, Prusa MINI+  
**Nozzles:** 0.2, 0.4, 0.6, and 0.8 mm for both printers  
**Materials:** PLA, PETG, ABS

### Specs

- **Bambu Lab X2D** - 10" x 10" x 10" build volume, enclosed with a heated chamber, dual nozzle for two materials/colors in one print
- **Prusa MINI+** - 7" x 7" x 7" build volume

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

1. **Design** in Fusion 360 or with AI-assisted G-code generation
2. **Slice** (modeled prints) and optimize print settings in Bambu Studio or PrusaSlicer
3. **Print** with tuned parameters for the material
4. **Finishing** - support removal, sanding, assembly

{% assign printer_projects = site.projects | where_exp: "project", "project.tools contains '3d-printer'" | sort: "published_date" | reverse %}
{% if printer_projects.size > 0 %}
### Recent Projects

{% for project in printer_projects limit: 8 %}
- [{{ project.title }}]({{ project.url | relative_url }})
{% endfor %}
- [View all 3D printing projects →](/?category=3d+printing#projects)

---
{% endif %}
