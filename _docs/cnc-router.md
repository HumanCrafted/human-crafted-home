---
layout: doc
title: CNC Router
slug: cnc-router
main_image:
featured: false
tags:
  - tools
published_date: 2025-06-12
gallery_images:
version:
draft: false
---
**Specs:** 24" x 48" cutting area, X-Carve Pro
**Materials:** Wood, plywood, MDF, acrylic, foam

### Capabilities

- **Precision cutting** - Repeatable cuts with tight tolerances
- **3D carving** - Contoured surfaces and relief carving
- **Large format** - 24" x 48" bed handles furniture-scale parts
- **Batch production** - Consistent results across multiple parts

### Materials I work with

- **Hardwood** - Walnut, maple, cherry for finished pieces and fixtures
- **Plywood** - Baltic birch and cabinet-grade for structural parts and enclosures
- **MDF** - Templates, jigs, and painted finished parts
- **Acrylic** - Signs, displays, and precision-cut components
- **Foam** - Packaging inserts and prototyping

### Process

1. **Design** in Fusion 360
2. **CAM** - Generate toolpaths and optimize for material
3. **Setup** - Secure stock, set zero, verify tool
4. **Cut** with optimized feeds and speeds
5. **Finishing** - sanding, assembly, quality check

{% assign cnc_projects = site.projects | where_exp: "project", "project.tools contains 'cnc-router'" | sort: "published_date" | reverse %}
{% if cnc_projects.size > 0 %}
### Recent Projects

{% for project in cnc_projects limit: 8 %}
- [{{ project.title }}]({{ project.url | relative_url }})
{% endfor %}

---
{% endif %}
