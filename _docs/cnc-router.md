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
version: "1.0"
draft: false
---
**Machine:** Inventables X-Carve Pro 4x2  
**Materials:** Wood, plywood, MDF, acrylic, foam  
**Tooling:** [[tooling|Documented here]]

### Specs

- **Work area** - 48" x 24" (X x Y), 4" max material thickness. Stock longer than 48" can be tiled through the open front/back, so length is only limited by the shop.
- **Z travel** - 6.5" with 5" gantry clearance
- **Spindle** - 2 hp (1.5 kW) air-cooled, VFD-driven, 8,000 - 24,000 RPM
- **Collet** - ER16; 1/8" and 1/4" collets included, 3/8" available
- **Drive** - 1" ball screws on linear guides, NEMA-23 steppers (292 oz-in)
- **Accuracy** - 0.001"
- **Control** - Enclosed controller with separate HMI, USB; runs standard G-code. I post from Fusion 360 and send with [gSender](https://sienci.com/gsender/)
- **Power** - 120 VAC, rated 5 A, standard 15 A circuit
- **Footprint** - 65.75" x 31.6" x 25", approx. 275 lbs
- **Dust collection** - Dust shoe with hose and boom arm to a standard shop vac
- **Spare parts** - [Inventables X-Carve Pro service parts](https://www.inventables.com/collections/x-carve-pro-service-parts)

Rated by Inventables for hardwoods, softwoods, plywood, MDF, plastics (HDPE, Delrin, polycarbonate, acrylic, Corian), and non-ferrous metals (aluminum, brass, copper).

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


{% assign cnc_projects = site.projects | where_exp: "project", "project.tools contains 'cnc-router'" | sort: "published_date" | reverse %}
{% if cnc_projects.size > 0 %}
### Recent Projects

{% for project in cnc_projects limit: 8 %}
- [{{ project.title }}]({{ project.url | relative_url }})
{% endfor %}

---
{% endif %}
