---
title: '~1/64" Down Cut (unmarked)'
serial: D08
vendor: Inventables
part_number: 
tool_type: End Mill
geometry: Downcut
cutting_diameter: "0.0155"
shank_diameter: "0.125"
flutes: 2
cutting_length: "0.250"
overall_length: "1.500"
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
best_for: "The finest detail work in the shop — thinner than D07, no room for error"
image: 
tags:
  - bit
layout: doc
slug: bit-inventables-1-64-downcut
version: "1.0"
draft: false
featured: false
---
Even smaller than [[bit-30667-01|D07]]: 0.0155" measured with calipers, no markings anywhere on the bit to confirm a part number against. 0.0155" sits close enough to 1/64" (0.015625") that it's almost certainly sold under that name, but nothing on the bit says so — the caliper reading is the ground truth here, not a nominal fraction. An orange plastic band marks it, matching Inventables' fine-detail engraving line, though the exact SKU in that lineup wasn't confirmable. Shank diameter (1/8") and flute count (2) are assumed from the pattern of every other small Inventables bit in the shop, not independently confirmed on this one.

## Specifications

| Property | Value |
| --- | --- |
| Cutting diameter | 0.0155" (measured; ~1/64" nominal) |
| Shank diameter | 0.125" (assumed, unconfirmed) |
| Flutes | 2 (assumed, unconfirmed) |
| Cutting length | 0.250" |
| Overall length | 1.500" |
| Geometry | Down cut spiral |
| Corner radius | None — square end |
| Material | Solid carbide |
| Coating | None |

## Feeds & Speeds

For the X-Carve Pro and its 1.5 kW spindle. Scaled down further from [[bit-30667-01|D07]]'s already first-principles numbers — this bit's cross-sectional area is roughly a quarter of D07's, so feed backs off another 30-40% and stepdown drops to single-digit thousandths. RPM stays flat across wood tiers for the same reason as D07: breakage risk, not spindle torque, is what limits this bit.

| Material | RPM | Feed | Chipload | Plunge | Stepdown |
| --- | --- | --- | --- | --- | --- |
| Hard maple / oak | 18,000 | 9 ipm | 0.00025" | 4 ipm | 0.008" |
| Soft maple / walnut / cherry | 18,000 | 10 ipm | 0.00028" | 4 ipm | 0.008" |
| Plywood / veneered sheet | 18,000 | 11 ipm | 0.00031" | 4 ipm | 0.008" |
| MDF / laminate | 18,000 | 12 ipm | 0.00033" | 4 ipm | 0.01" |
| Softwood / pine | 18,000 | 12 ipm | 0.00033" | 4 ipm | 0.01" |
| Acrylic / HDPE | 14,000 | 9 ipm | 0.00032" | 4 ipm | 0.006" |

## Notes

**Maximum cut depth is 0.25"** — a little more than D07's 0.2", despite the smaller diameter. Flute length and cutting diameter don't scale together on these detail bits.

**More fragile than D07, not less** — a smaller diameter than an already-fragile bit. Every number above assumes it will snap if pushed past it. Constant chip clearance, dead-slow feeds, and a toolpath that never dwells or reverses under load.

**Unconfirmed shank and flute count.** Every other small Inventables bit in the shop (D07, B03) uses a 1/8" shank and 2 flutes, and this one is assumed to match, but nobody's checked it directly. Worth confirming with calipers on the shank next time it's in hand, and correcting this note if it's wrong.

**Always ramp — never plunge**, same as every downcut here, doubly true at this scale.

## Links

- Database: [[tooling|Tooling]]
- CAM library: Fusion hub library, *Human Crafted* (T21)
