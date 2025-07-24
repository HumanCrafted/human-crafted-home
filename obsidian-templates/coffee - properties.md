---
name: Coffee Name
roaster: Roaster Name
origin: Country/Region
process:
  - Washed/Natural/Honey
roast_level: Light/Medium/Dark
harvest: 
elevation: 
date_purchased: 
date_roasted: 
price: 
rating_1-5: 
coffee_bag_image: "![](../assets/images/filename.jpg)"
main_image: "/assets/images/filename.jpg" 
tags:
  - coffee
layout: doc
slug: 
version: "1"
draft: false
---

{% if page.coffee_bag_image %}
  {% assign image_filename = page.coffee_bag_image | replace: '![](', '' | replace: ')', '' | replace: '../assets/images/', '' %}
  <div class="coffee-bag-image" style="text-align: center; margin: 2rem 0;">
    <img src="{{ '/assets/images/' | append: image_filename | relative_url }}" alt="{{ page.name }} coffee bag" style="max-width: 300px; height: auto; border-radius: 8px;">
  </div>
{% endif %}

## Tasting Notes
- 

## Brewing Recommendation
Resting Time: 
Filter Brew: 
Espresso: 

## Other Notes


## Links
- Roaster: [Roaster Name]({{ "/roaster-slug/" | relative_url }})