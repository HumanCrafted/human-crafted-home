---
title: '1/8" 2-Flute Up Cut Spiral'
serial: U05
vendor: Bits & Bits
part_number: DF125UP
tool_type: End Mill
geometry: Upcut
cutting_diameter: "0.125"
shank_diameter: "0.125"
flutes: 2
cutting_length: "1.000"
overall_length: "2.000"
corner_radius: "0"
tip_angle: 
material: Solid Carbide
coating: AstraHP
machine: "[[cnc-router|X-Carve Pro]]"
price: 
date_purchased: 
purchase_url: https://bitsbits.com/product/df125up-upcut/
in_fusion_library: true
status: in service
best_for: "Deep small-diameter slots and mortising — 1\" of flute in a 1/8\" bit"
image: 
tags:
  - bit
layout: doc
slug: bit-df125up
version: "1.0"
draft: false
featured: false
---
Ties [[bit-820-dnc125|D06]] for the deepest-reaching 1/8" bit in the shop: a full 1" of flute on a bit that thin, double [[bit-46200|D03]]'s 0.5" and [[bit-46127-k|U07]]'s 0.5". Bits & Bits lists this part as discontinued and replaced by their 820-SRF125, but the physical bit reads DF125UP, so that's what's recorded here.

## Specifications

| Property | Value |
| --- | --- |
| Cutting diameter | 0.125" |
| Shank diameter | 0.125" (straight through) |
| Flutes | 2 |
| Cutting length | 1.000" |
| Overall length | 2.000" |
| Geometry | Up cut spiral |
| Corner radius | None — square end |
| Material | Solid carbide |
| Coating | AstraHP |

## Feeds & Speeds

For the X-Carve Pro and its 1.5 kW spindle. Same halved-from-1/4" chipload as [[bit-46200|D03]], but upcut stepdown instead of downcut — chips evacuate upward on their own, so only the diameter (not chip-packing) limits the depth per pass, giving roughly double D03's stepdown at the same chipload.

| Material | RPM | Feed | Chipload | Plunge | Stepdown |
| --- | --- | --- | --- | --- | --- |
| Hard maple / oak | 14,000 | 110 ipm | 0.0039" | 30 ipm | 0.125" |
| Soft maple / walnut / cherry | 14,000 | 120 ipm | 0.0043" | 30 ipm | 0.125" |
| Plywood | 16,000 | 140 ipm | 0.0044" | 35 ipm | 0.125" |
| MDF / laminate | 16,000 | 150 ipm | 0.0047" | 35 ipm | 0.1875" |
| Softwood / pine | 16,000 | 150 ipm | 0.0047" | 35 ipm | 0.1875" |
| Acrylic / HDPE | 12,000 | 100 ipm | 0.0042" | 20 ipm | 0.0625" |

## Notes

**Plunges fine — this is an upcut, no chip-packing problem.** Unlike every downcut in the drawer, a straight Z plunge here just augers chips up and out as it goes.

**Tears the top face on plywood and veneer.** Same tradeoff as every upcut: the geometry that clears chips so well also lifts and chips the top surface fibers on the way up. Reach for [[bit-46200|D03]] or [[bit-46341|D04]] instead whenever the top face shows.

**1" of cutting length ties [[bit-820-dnc125|D06]] for the deepest reach among the 1/8" bits** — deep enough for a mortise or a slot through the better part of an inch of material, where D03/D04/U06/U07 all top out around 0.5–0.56". Reach for this one over D06 when the top face doesn't matter and upcut evacuation is worth more than a clean surface; D06 for the reverse.

## Links

- Product page: [Bits & Bits DF125UP](https://bitsbits.com/product/df125up-upcut/)
- Machine: [[cnc-router|X-Carve Pro]]
- CAM library: Fusion hub library, *Human Crafted* (T15)
