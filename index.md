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
      "for sale" filter: only the projects currently for sale. Rendered only
      while the shop is on AND something is available, so a shop with nothing
      listed doesn't advertise an empty filter. Same words as the pill on the
      cards, so the two read as one thing ("shop" was rejected — it's the
      workshop everywhere else on the site, including the "around the shop"
      category). Not a category — the script matches it against data-shop on
      each card instead of data-categories.
    {%- endcomment -%}
    {%- if site.shop_enabled -%}
      {%- assign for_sale_count = site.projects | where: "shop_status", "available" | where: "draft", false | size -%}
      {%- if for_sale_count > 0 %}
    <button class="tag-filter" data-filter="for sale">for sale</button>
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

<div class="project-grid">
  {% assign sorted_projects = site.projects | where: 'draft', false | sort: 'published_date' | reverse %}
  {% for project in sorted_projects %}
    <a href="{{ project.url | relative_url }}" class="project-card" data-categories="{{ project.categories | join: ',' }}"{% if site.shop_enabled and project.shop_status == "available" %} data-shop="available"{% endif %}>
      <div class="project-image">
        {%- comment -%}
          Only currently-available projects get the "shop" pill. Archived ones
          keep their price/variants on the detail page but read as ordinary
          archive entries here.
        {%- endcomment -%}
        {% if site.shop_enabled and project.shop_status == "available" %}{% include for-sale-icon.html %}{% endif %}
        {% if project.main_image %}
          {% if project.main_image contains '![[' %}
            {% assign image_filename = project.main_image | replace: '![[', '' | replace: ']]', '' %}
            <img src="{{ '/assets/images/' | append: image_filename | relative_url }}" alt="{{ project.title }}" />
          {% elsif project.main_image contains '../assets/images/' %}
            {% assign image_filename = project.main_image | replace: '![](', '' | replace: ')', '' | replace: '../assets/images/', '' %}
            <img src="{{ '/assets/images/' | append: image_filename | relative_url }}" alt="{{ project.title }}" />
          {% else %}
            {% assign image_path = project.main_image | replace: '![', '' | replace: '](', '' | replace: ')', '' | split: '](' | last %}
            <img src="{{ image_path | relative_url }}" alt="{{ project.title }}" />
          {% endif %}
        {% else %}
          <!-- Fallback SVG -->
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            <rect x="10" y="30" width="100" height="40" fill="#666" rx="4"/>
          </svg>
        {% endif %}
      </div>
      <h3 class="project-title">{{ project.title }}</h3>
    </a>
  {% endfor %}
</div>

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
      } else if (filterValue === 'for sale') {
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