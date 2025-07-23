---
layout: doc
title: Coffee
slug: coffee
main_image: 
featured: false
tags:
  - note
published_date: 2025-07-21
gallery_images: 
version: "1"
draft: false
---
# Coffee Database

A collection of coffee beans I've tried, rated, and reviewed.

```dataview
TABLE 
  "![Image](" + image + ")" as Bag,
  name as "Coffee",
  roaster as "Roaster", 
  origin as "Origin",
  rating + "/7" as "Rating",
  price as "Price",
  date_tried as "Tried"
FROM "_docs"
WHERE contains(tags, "coffee")
SORT date_tried DESC
```

## Rating System
- **7** - Exceptional, would buy again immediately
- **6** - Excellent, highly recommend  
- **5** - Very good, solid choice
- **4** - Good, decent coffee
- **3** - Okay, drinkable but nothing special
- **2** - Poor, wouldn't recommend
- **1** - Terrible, avoid

## Recent Coffee Notes

*Individual coffee reviews and detailed tasting notes appear below as I add them to the database.*
