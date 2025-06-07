---
layout: default
title: Human Crafted
---

A product design studio specializing in the rapid realization of ideas.

<div class="archive-header">
  <h2 class="archive-title">The Archive</h2>
  
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
  {% assign sorted_projects = site.projects | sort: 'published_date' | reverse %}
  {% for project in sorted_projects %}
    <a href="{{ project.url | relative_url }}" class="project-card" data-categories="{{ project.categories | join: ',' }}">
      <div class="project-image">
        {% if project.main_image %}
          {% assign image_path = project.main_image | replace: '![', '' | replace: '](', '' | replace: ')', '' | split: '](' | last %}
          <img src="{{ image_path | relative_url }}" alt="{{ project.title }}" />
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
  
  filters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Update active state
      filters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');
      
      const filterValue = this.dataset.filter;
      
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
    });
  });
});
</script>