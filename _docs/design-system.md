---
layout: doc
title: Design System
slug: design-system
main_image:
featured: false
tags:
  - note
published_date: 2026-06-10
version: "1.0"
draft: false
---

The Human Crafted design system. Tokens, components, and patterns I use across humancrafted.co, sub-brand tools, and client deliverables. Built to stay coherent as the work expands — and small enough to drop into a Claude skill or a fresh project as a single source of truth.

<div class="wiki-two-column system-row">
  <h3 class="wiki-section-title">Color</h3>
  <div class="system-content">
    <div class="system-swatches">
      <div class="system-chip"><span class="chip-box" style="background:#FAF7F2"></span><span class="chip-name">paper</span><span class="chip-hex">#FAF7F2</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#ECE3CE"></span><span class="chip-name">paper-warm</span><span class="chip-hex">#ECE3CE</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#2A2824"></span><span class="chip-name">ink</span><span class="chip-hex">#2A2824</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#736356"></span><span class="chip-name">ink-muted</span><span class="chip-hex">#736356</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#948F87"></span><span class="chip-name">border</span><span class="chip-hex">#948F87</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#E8C84A"></span><span class="chip-name">accent</span><span class="chip-hex">#E8C84A</span></div>
    </div>
    <p class="system-note">Sub-brand palette — one hue pair per sub-brand or project identity.</p>
    <div class="system-swatches">
      <div class="system-chip"><span class="chip-box" style="background:#E8C84A"></span><span class="chip-name">yellow</span><span class="chip-hex">#E8C84A</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#C9A832"></span><span class="chip-name">yellow-deep</span><span class="chip-hex">#C9A832</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#C78A2E"></span><span class="chip-name">gold</span><span class="chip-hex">#C78A2E</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#9A6720"></span><span class="chip-name">gold-deep</span><span class="chip-hex">#9A6720</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#8A8030"></span><span class="chip-name">olive</span><span class="chip-hex">#8A8030</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#736B1E"></span><span class="chip-name">olive-deep</span><span class="chip-hex">#736B1E</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#3B4B59"></span><span class="chip-name">slate</span><span class="chip-hex">#3B4B59</span></div>
      <div class="system-chip"><span class="chip-box" style="background:#2C3A47"></span><span class="chip-name">slate-deep</span><span class="chip-hex">#2C3A47</span></div>
    </div>
  </div>
</div>

<div class="wiki-two-column system-row">
  <h3 class="wiki-section-title">Typography</h3>
  <div class="system-content">
    <div class="system-type-row">
      <span class="type-label">hero / 48 / Reg</span>
      <span class="type-specimen ts-hero">A product design studio.</span>
    </div>
    <div class="system-type-row">
      <span class="type-label">title / 30 / Bol</span>
      <span class="type-specimen ts-title">human / crafted</span>
    </div>
    <div class="system-type-row">
      <span class="type-label">eyebrow / 18 / M</span>
      <span class="type-specimen ts-eyebrow">The Archive ↓</span>
    </div>
    <div class="system-type-row">
      <span class="type-label">body / 16 / Reg</span>
      <span class="type-specimen ts-body">around the house · 3d printing · kitchen</span>
    </div>
    <div class="system-type-row">
      <span class="type-label">caption / 14 / R</span>
      <span class="type-specimen ts-caption">© 2025 Human Crafted LLC.</span>
    </div>
  </div>
</div>

<div class="wiki-two-column system-row">
  <h3 class="wiki-section-title">Spacing</h3>
  <div class="system-content">
    <div class="system-space-row"><span class="space-label">space-1</span><span class="space-meta">1rem · 16px</span><span class="space-bar" style="width:16px"></span></div>
    <div class="system-space-row"><span class="space-label">space-2</span><span class="space-meta">2rem · 32px</span><span class="space-bar" style="width:32px"></span></div>
    <div class="system-space-row"><span class="space-label">space-4</span><span class="space-meta">4rem · 64px</span><span class="space-bar" style="width:64px"></span></div>
    <div class="system-space-row"><span class="space-label">space-5</span><span class="space-meta">5rem · 80px</span><span class="space-bar" style="width:80px"></span></div>
    <div class="system-space-row"><span class="space-label">space-6</span><span class="space-meta">6rem · 96px</span><span class="space-bar" style="width:96px"></span></div>
  </div>
</div>

<div class="wiki-two-column system-row">
  <h3 class="wiki-section-title">Components</h3>
  <div class="system-content">
    <p class="system-components">Button, Nav link, Category tag, Footer, Section heading</p>
  </div>
</div>

<script>
(function () {
  document.querySelectorAll('.system-chip').forEach(function (chip) {
    var hexEl = chip.querySelector('.chip-hex');
    if (!hexEl) return;
    var hex = hexEl.textContent.trim();
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('aria-label', 'Copy hex ' + hex);
    chip.title = 'Click to copy ' + hex;
    var resetTimer;
    function flash() {
      chip.classList.add('copied');
      hexEl.textContent = 'copied!';
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        hexEl.textContent = hex;
        chip.classList.remove('copied');
      }, 1100);
    }
    function legacyCopy() {
      var ta = document.createElement('textarea');
      ta.value = hex;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      flash();
    }
    function copy() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex).then(flash).catch(legacyCopy);
      } else {
        legacyCopy();
      }
    }
    chip.addEventListener('click', copy);
    chip.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); }
    });
  });
})();
</script>
