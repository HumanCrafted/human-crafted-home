---
layout: default
title: Fusion360
permalink: /fusion360/
tag:
  - tools
  - CAD design and engineering
tool_type: CAD Software
specs: Autodesk Fusion360 Professional
---

**Software:** Autodesk Fusion360 Professional  
**Applications:** Product design, mechanical engineering, prototyping

## Capabilities

- **Parametric Modeling** - Feature-based design with full edit history
- **Assembly Design** - Multi-part assemblies with joints and constraints
- **Simulation** - Stress analysis, thermal, and fluid dynamics
- **Manufacturing** - CAM toolpaths for CNC, 3D printing preparation

## Design Process

1. **Sketch** - 2D profiles with parametric constraints
2. **Model** - 3D features built from sketches
3. **Assemble** - Components with realistic joints and motion
4. **Simulate** - Test designs before manufacturing
5. **Manufacture** - Generate toolpaths and export files

## Project Types

- **Functional Prototypes** - Moving parts with proper clearances
- **Manufacturing Fixtures** - Jigs and tooling for production
- **Product Design** - Consumer goods with aesthetic and functional requirements
- **Technical Parts** - Precision components for mechanical systems

## Recent Projects

{% assign fusion_projects = site.projects | where_exp: "project", "project.content contains 'Fusion360'" %}
{% for project in fusion_projects limit: 8 %}
- [{{ project.title }}]({{ project.url }})
{% endfor %}

---