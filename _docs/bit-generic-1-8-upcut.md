---
title: '1/8" 2-Flute Up Cut Spiral (unbranded)'
serial: U06
vendor: Unknown
part_number: 
tool_type: End Mill
geometry: Upcut
cutting_diameter: "0.125"
shank_diameter: "0.125"
flutes: 2
cutting_length: "0.560"
overall_length: "1.530"
corner_radius: "0"
tip_angle: 
material: Solid Carbide
coating: 
machine: "[[cnc-router|X-Carve Pro]]"
price: 
date_purchased: 
purchase_url: 
in_fusion_library: true
status: in service
best_for: "Shallow small-diameter slotting — no vendor spec to lean on"
image: 
tags:
  - bit
layout: doc
slug: bit-generic-1-8-upcut
version: "1.0"
draft: false
featured: false
---
No brand, no part number, no product page to check specs against — like [[bit-81618|U01]] and [[bit-generic-3-16-wood|T05]] before it. Measured directly: 1/8" cutting diameter, 1/8" straight shank, 2 flutes, up cut. The shortest bit in the drawer at 1.53" overall.

## Specifications

| Property | Value |
| --- | --- |
| Cutting diameter | 0.125" |
| Shank diameter | 0.125" (straight through) |
| Flutes | 2 |
| Cutting length | 0.560" |
| Overall length | 1.530" |
| Geometry | Up cut spiral |
| Corner radius | None — square end |
| Material | Solid carbide (assumed — unconfirmed) |
| Coating | Unknown |

## Feeds & Speeds

For the X-Carve Pro and its 1.5 kW spindle. Same numbers as [[bit-df125up|U05]] and [[bit-46127-k|U07]] — same diameter, same upcut geometry class, no vendor data to justify deviating from the house 1/8" upcut ladder.

| Material | RPM | Feed | Chipload | Plunge | Stepdown |
| --- | --- | --- | --- | --- | --- |
| Hard maple / oak | 14,000 | 110 ipm | 0.0039" | 30 ipm | 0.125" |
| Soft maple / walnut / cherry | 14,000 | 120 ipm | 0.0043" | 30 ipm | 0.125" |
| Plywood | 16,000 | 140 ipm | 0.0044" | 35 ipm | 0.125" |
| MDF / laminate | 16,000 | 150 ipm | 0.0047" | 35 ipm | 0.1875" |
| Softwood / pine | 16,000 | 150 ipm | 0.0047" | 35 ipm | 0.1875" |
| Acrylic / HDPE | 12,000 | 100 ipm | 0.0042" | 20 ipm | 0.0625" |

## Notes

**Unconfirmed coating and grade, like every unbranded bit here.** Treated as plain solid carbide by default since nothing on it says otherwise. If it turns out to run hotter or dull faster than the branded 1/8" upcuts, that's the likely reason.

**Maximum cut depth is 0.56"** — short even by 1/8" standards, closer to D03/D04's 0.5" than U05's full 1".

**Plunges fine, same as any upcut** — chips clear upward, no packing risk on a straight Z entry.

## Links

- Database: [[tooling|Tooling]]
- CAM library: Fusion hub library, *Human Crafted* (T17)
