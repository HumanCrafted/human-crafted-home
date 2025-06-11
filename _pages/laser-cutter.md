---
layout: default
title: Laser Cutter/Engraver
permalink: /laser-cutter/
tag:
  - tools
  - fabrication
  - manufacturing
tool_type: Laser Cutter/Engraver
specs: 1300mm x 900mm 150 Watt CO2
---

**Specs:** 1300mm x 900mm 150 Watt CO2  
**Materials:** Wood, acrylic, cardboard, fabric, leather, paper

### Capabilities

- **Cutting** - Precise cuts through materials up to ~20mm thick
- **Engraving** - Surface marking and deep engraving
- **Large bed** - 51" x 35" working area for big projects
- **High power** - 150W tube handles thick materials efficiently

### Materials I work with

- **Acrylic** - Clean cuts, polished edges, great for displays and functional parts
- **Wood** - Plywood, MDF, hardwood for furniture, fixtures, and prototypes  
- **Cardboard** - Rapid prototyping, packaging mockups, templates
- **Fabric** - Custom gaskets, soft goods, upholstery components
- **Paper** - Stencils, templates, packaging inserts

### Process

1. **Design** in Fusion360 or Illustrator
2. **Test cuts** on small samples to dial in settings
3. **Production** with optimized parameters
4. **Finishing** - sanding, assembly, quality check

### Recent Projects

{% assign laser_projects = site.projects | where_exp: "project", "project.content contains 'acrylic'" %}
{% for project in laser_projects limit: 8 %}
- [{{ project.title }}]({{ project.url }})
{% endfor %}

---