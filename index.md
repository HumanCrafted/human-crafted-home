---
layout: default
title:
---

<h1 class="hero-title">A design studio specializing in the rapid realization of ideas.</h1>

<hr class="section-divider">

<div class="projects-header">
  <h2 class="projects-title" id="projects">Projects</h2>
  
  <div class="tag-filters">
    <button class="tag-filter active" data-filter="all">all</button>
    {%- comment -%}
      "made" filter: only the projects currently for sale, under the Made
      sub-brand wordmark — the same mark the cards carry and the products ship
      with. (Earlier: "for sale" text; "shop" before that, rejected because on
      this site it means the workshop.) Rendered only while the shop is on AND
      something is available. Not a category — the script matches it against
      data-shop on each card instead of data-categories.
    {%- endcomment -%}
    {%- if site.shop_enabled -%}
      {%- assign for_sale_count = site.projects | where: "shop_status", "available" | where: "draft", false | size -%}
      {%- if for_sale_count > 0 %}
    <button class="tag-filter tag-filter--made" data-filter="made" aria-label="Made — available to buy">{% include made-wordmark.html %}</button>
      {%- endif -%}
    {%- endif %}
    {% assign all_categories = site.projects | map: 'categories' | join: ',' | split: ',' | uniq | sort %}
    {% for category in all_categories %}
      {% unless category == blank %}
        <button class="tag-filter" data-filter="{{ category | strip }}">{{ category | strip }}</button>
      {% endunless %}
    {% endfor %}
  </div>
</div>

{% include project-grid.html %}

<script>
// Tag filtering functionality
document.addEventListener('DOMContentLoaded', function() {
  const filters = document.querySelectorAll('.tag-filter');
  const projects = document.querySelectorAll('.project-card');
  
  // Function to apply filter
  function applyFilter(filterValue) {
    // Update active state
    filters.forEach(f => f.classList.remove('active'));
    const activeFilter = document.querySelector(`[data-filter="${filterValue}"]`);
    if (activeFilter) {
      activeFilter.classList.add('active');
    }
    
    // Filter projects
    projects.forEach(project => {
      if (filterValue === 'all') {
        project.style.display = 'block';
      {%- if site.shop_enabled %}
      } else if (filterValue === 'made') {
        // Not a category: the for-sale cards carry data-shop.
        project.style.display = project.dataset.shop === 'available' ? 'block' : 'none';
      {%- endif %}
      } else {
        const categories = project.dataset.categories.split(',');
        if (categories.includes(filterValue)) {
          project.style.display = 'block';
        } else {
          project.style.display = 'none';
        }
      }
    });
  }
  
  // Check URL parameters on page load
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  // Only honour a filter that exists, so a stale link can't hide every card.
  if (categoryParam && document.querySelector(`[data-filter="${CSS.escape(categoryParam)}"]`)) {
    // Small delay to ensure the page has loaded and the anchor scroll has happened
    setTimeout(() => {
      applyFilter(categoryParam);
    }, 100);
  }
  
  // Add click event listeners
  filters.forEach(filter => {
    filter.addEventListener('click', function() {
      const filterValue = this.dataset.filter;
      applyFilter(filterValue);
    });
  });
});
</script>