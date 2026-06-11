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
  <h3 class="wiki-section-title">Layout</h3>
  <div class="system-content">
    <p class="system-note" style="margin-top:0">The project archive is a responsive grid; long-form Notes use a fixed two-column rhythm. A <code>scrollbar-gutter: stable</code> gutter reserves space for the scrollbar so short and long pages center identically.</p>
    <div class="layout-row">
      <span class="layout-label">archive · desktop<br><span class="layout-sub">5 columns · gap 4rem/2rem</span></span>
      <div class="layout-demo layout-demo--5"><span class="cell"></span><span class="cell"></span><span class="cell"></span><span class="cell"></span><span class="cell"></span></div>
    </div>
    <div class="layout-row">
      <span class="layout-label">archive · ≤1024px<br><span class="layout-sub">3 columns</span></span>
      <div class="layout-demo layout-demo--3"><span class="cell"></span><span class="cell"></span><span class="cell"></span></div>
    </div>
    <div class="layout-row">
      <span class="layout-label">archive · ≤768px<br><span class="layout-sub">2 columns</span></span>
      <div class="layout-demo layout-demo--2"><span class="cell"></span><span class="cell"></span></div>
    </div>
    <div class="layout-row">
      <span class="layout-label">Notes · two-column<br><span class="layout-sub">180px label · 1fr body</span></span>
      <div class="layout-demo layout-demo--doc"><span class="cell cell--label"></span><span class="cell"></span></div>
    </div>
  </div>
</div>

<div class="wiki-two-column system-row">
  <h3 class="wiki-section-title">Links &amp; underlines</h3>
  <div class="system-content">
    <p class="system-note" style="margin-top:0">Links never borrow the accent color — emphasis comes from a hand-drawn <strong>wavy underline</strong> on hover, paired with a step up to medium weight. Hover each specimen to see the transition.</p>
    <div class="system-link-row">
      <span class="link-label">content link</span>
      <span class="link-specimen"><a href="{{ '/design-system/' | relative_url }}">solid underline at rest</a></span>
    </div>
    <div class="system-link-row">
      <span class="link-label">on hover →</span>
      <span class="link-specimen"><span class="demo-static-wavy">wavy underline, medium weight</span></span>
    </div>
    <div class="system-link-row">
      <span class="link-label">nav link</span>
      <span class="link-specimen"><a href="{{ '/design-system/' | relative_url }}" class="demo-navlink">no underline until hover</a></span>
    </div>
    <div class="system-link-row">
      <span class="link-label">external</span>
      <span class="link-specimen"><a href="https://example.com">trails an arrow glyph</a></span>
    </div>
  </div>
</div>

<div class="wiki-two-column system-row">
  <h3 class="wiki-section-title">Iconography</h3>
  <div class="system-content">
    <p class="system-note" style="margin-top:0"><strong>Interface icons — Lucide</strong> (the maintained fork of Feather Icons). A 24×24 grid with 2px strokes and round caps. They inherit <code>currentColor</code>, so they recolor for dark mode with no second asset.</p>
    <div class="system-icon-list">
      <div class="icon-row">
        <span class="icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg></span>
        <span class="icon-name">menu</span>
        <span class="icon-use">co/re nav</span>
      </div>
      <div class="icon-row">
        <span class="icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></span>
        <span class="icon-name">sun</span>
        <span class="icon-use">theme · light</span>
      </div>
      <div class="icon-row">
        <span class="icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>
        <span class="icon-name">moon</span>
        <span class="icon-use">theme · dark</span>
      </div>
      <div class="icon-row">
        <span class="icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></span>
        <span class="icon-name">arrow-right</span>
        <span class="icon-use">co/lab CTA</span>
      </div>
    </div>
  </div>
</div>

<div class="wiki-two-column system-row">
  <h3 class="wiki-section-title">Illustration</h3>
  <div class="system-content">
    <div class="system-illustration">
      <figure class="illo-figure">
        <img src="{{ '/assets/images/tissue-dispenser-thumbnail.svg' | relative_url }}" alt="Tissue dispenser — single-color isometric line illustration used as a project thumbnail" width="200" height="200" loading="lazy">
        <figcaption>project thumbnail</figcaption>
      </figure>
      <div class="illo-notes">
        <p>Every project is cataloged with a single-color SVG thumbnail — a CAD or illustration artifact of the object design with a specific visual style.</p>
        <ul class="system-spec-list">
          <li>One color, no shading — a vector illustration, not a render or image</li>
          <li>1000 × 1000 viewBox, centered with generous margin</li>
          <li>Vector SVG: crisp at any size</li>
          <li>Dark mode inverts the ink with a CSS filter — no second asset</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div class="wiki-two-column system-row">
  <h3 class="wiki-section-title">Wordmark</h3>
  <div class="system-content">
    <p class="system-note" style="margin-top:0">The header wordmark is a live breadcrumb built on the <code>.co</code> domain and doubles as back-navigation when visiting core and sub-pages. Dim segments link to home or up a level; the bright segment is the current page. Hover a dim segment to see it light up.</p>
    <div class="wm-specimen-list">
      <div class="wm-specimen-row">
        <span class="wm-state-label">home</span>
        <span class="site-title wm-specimen"><span class="wm-human">human</span><span class="wm-slash--home">/</span><span class="wm-crafted">crafted</span></span>
      </div>
      <div class="wm-specimen-row">
        <span class="wm-state-label">core page</span>
        <span class="site-title site-title--crumb wm-specimen"><span class="wm-back">humancrafted</span><span class="wm-tail"><span class="wm-dot">.</span><span class="wm-current">co<span class="wm-slash">/</span>lab</span></span></span>
      </div>
      <div class="wm-specimen-row">
        <span class="wm-state-label">sub-page</span>
        <span class="site-title site-title--crumb wm-specimen"><span class="wm-back">humancrafted</span><span class="wm-tail"><span class="wm-dot">.</span><span class="wm-hub">co<span class="wm-slash">/</span>re</span><span class="wm-new"><span class="wm-sep">/</span><span class="wm-current">Design System</span></span></span></span>
      </div>
    </div>
    <p class="system-note">On load, breadcrumb pages wipe in only the newest segment; home reassembles to <code>human / crafted</code> when you arrive from an internal page. Skipped for reduced-motion or backgrounded tabs. Real URLs stay flat — the nesting is visual only, no SEO migration.</p>
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
