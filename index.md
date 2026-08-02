---
layout: default
title:
---

<h1 class="hero-title">A design studio specializing in the rapid realization of ideas.</h1>

<hr class="section-divider">

<div class="archive-header">
  <h2 class="archive-title" id="archive">The Archive</h2>
  
  <div class="tag-filters">
    <button class="tag-filter active" data-filter="all">all</button>
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
    <a href="{{ project.url | relative_url }}" class="project-card" data-categories="{{ project.categories | join: ',' }}">
      <div class="project-image">
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
      <h3 class="project-title">
        {%- comment -%}
          Only currently-available projects get the "$" mark. Archived ones keep
          their price/variants on the detail page but read as ordinary archive
          entries here.
        {%- endcomment -%}
        {%- if site.shop_enabled and project.shop_status == "available" -%}
          {%- comment -%}
            Keep the "$" disc welded to the last word: an atomic inline box gets
            bumped to its own line when the title fills the column, which left
            the disc stranded under mobile cards. Last word + disc go in one
            nowrap span so they wrap together.
          {%- endcomment -%}
          {%- assign _words = project.title | split: " " -%}
          {%- if _words.size > 1 -%}
            {%- assign _head_len = _words.size | minus: 1 -%}
            {%- comment -%}
              The trailing space is appended to the STRING, not left as template
              whitespace — the surrounding whitespace-trimming tags would eat a
              literal one and glue the last word on ("Bi-FoldWallet").
            {%- endcomment -%}
            {{ _words | slice: 0, _head_len | join: " " | append: " " }}
          {%- endif -%}
          <span class="title-tail">{{ _words | last }}{% include for-sale-icon.html %}</span>
        {%- else -%}
          {{ project.title }}
        {%- endif -%}
      </h3>
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
  if (categoryParam) {
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