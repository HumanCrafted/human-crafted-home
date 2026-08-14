/**
 * Places map — renders the _places collection on a Leaflet map.
 * Data comes from #places-data (JSON emitted by _includes/places-data.html).
 * Tiles are Esri's Gray Canvas + Reference pair (light/dark) — a neutral
 * gray basemap with state/country boundaries and labels baked into the
 * theme itself, swapped wholesale on theme flip rather than filtered.
 * Markers are circleMarkers colored from the design tokens, restyled live
 * on the same flip (see the data-theme MutationObserver).
 */
(function () {
  'use strict';

  var SOURCE_LABELS = {
    'wisconsin-foodie': 'Wisconsin Foodie Spots',
    'top-chef': 'Top Chef Restaurants',
    'james-beard': 'James Beard',
    'personal': 'personal'
  };

  // Lucide maximize/minimize — same inline-SVG convention as the STL viewer's
  // rotate-3d hint, kept out of markdown so kramdown never touches it.
  var EXPAND_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
  var COMPRESS_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>';

  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // Design-system accent hues (main.css --ds-* tokens), keyed by the names a
  // place's `color:` frontmatter accepts. Resolving through the token keeps
  // pins theme-aware — each hue swaps to its "deep" variant on dark flip.
  var DS_COLORS = {
    yellow: '--ds-yellow',
    gold: '--ds-gold',
    olive: '--ds-olive',
    slate: '--ds-slate',
    gray: '--muted',   // closed pins — the neutral, not a design-system hue
    grey: '--muted'
  };

  // A place's color as a CSS var() when it names a design-system hue (so the
  // theme swap follows the token), else the literal value.
  function colorVar(c) {
    var key = String(c == null ? '' : c).toLowerCase().trim();
    return DS_COLORS[key] ? 'var(' + DS_COLORS[key] + ')' : c;
  }
  function resolveColor(c) {
    var key = String(c).toLowerCase().trim();
    if (DS_COLORS[key]) return token(DS_COLORS[key]);
    return c; // literal CSS color (e.g. a hex) — used as-is, no theme swap
  }

  function markerStyle(fill) {
    return {
      radius: 7,
      fillColor: fill || token('--accent'),
      color: token('--foreground'),
      weight: 1.5,
      fillOpacity: 0.9
    };
  }

  // Esri's free, keyless "Canvas" basemap family. Base alone already bakes
  // in state-level boundaries + labels — deliberately NOT pairing it with
  // Esri's own Reference layer, which adds county lines, city dots, and
  // (at closer zoom) roads on top; that's the "too much detail" clutter.
  var TILE_SETS = {
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
  };
  var TILE_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS user community';

  function init() {
    var el = document.getElementById('places-map');
    var dataEl = document.getElementById('places-data');
    if (!el || !dataEl || typeof L === 'undefined') return;

    var places;
    try {
      places = JSON.parse(dataEl.textContent);
    } catch (e) {
      return;
    }

    // Esri's gray canvas is flat and clean at state-wide zoom, but past
    // z~11 it starts rendering real street grids. DEFAULT_ZOOM_CAP keeps
    // the *auto-framed* view (fitBounds / single-pin setView, below) from
    // ever landing there uninvited — it does NOT limit the map overall,
    // so a reader can still scroll/pinch/+ deeper to pull apart pins
    // packed into one city; street grids showing up at that point is fine
    // since the reader chose to zoom in that far.
    var DEFAULT_ZOOM_CAP = 10;
    var map = L.map(el, { scrollWheelZoom: false }).setView([44.6, -89.8], 6);

    // Tiles swap wholesale on theme flip (see the MutationObserver below)
    // rather than being filtered — a genuinely different tile set, not a
    // light one inverted to fake a dark one.
    var activeTileLayer = null;
    function setTileTheme(isDark) {
      if (activeTileLayer) map.removeLayer(activeTileLayer);
      var url = isDark ? TILE_SETS.dark : TILE_SETS.light;
      activeTileLayer = L.tileLayer(url, { maxZoom: 16, attribution: TILE_ATTRIBUTION }).addTo(map);
    }
    setTileTheme(document.documentElement.getAttribute('data-theme') === 'dark');

    // ---- Fullscreen toggle ----
    var isFullscreen = false;
    var expandBtn;
    var ExpandControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function () {
        expandBtn = L.DomUtil.create('button', 'places-expand-btn');
        expandBtn.type = 'button';
        expandBtn.setAttribute('aria-label', 'Expand map to full screen');
        expandBtn.innerHTML = EXPAND_ICON;
        L.DomEvent.disableClickPropagation(expandBtn);
        L.DomEvent.on(expandBtn, 'click', toggleFullscreen);
        return expandBtn;
      }
    });
    map.addControl(new ExpandControl());

    function toggleFullscreen() {
      isFullscreen = !isFullscreen;
      el.classList.toggle('is-fullscreen', isFullscreen);
      document.body.classList.toggle('places-map-open', isFullscreen);
      expandBtn.innerHTML = isFullscreen ? COMPRESS_ICON : EXPAND_ICON;
      expandBtn.setAttribute('aria-label', isFullscreen ? 'Exit full screen' : 'Expand map to full screen');
      // Let the layout settle into its new size before Leaflet re-measures,
      // or tiles render for the old (smaller) box and leave gray gaps.
      setTimeout(function () { map.invalidateSize(); }, 60);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen();
    });

    // Match the STL viewer's convention: plain page scroll is never hijacked —
    // zoom needs ctrl/meta (what a trackpad pinch sends) or the +/- controls.
    // In fullscreen there's no page scroll to protect (body is scroll-locked),
    // so plain wheel zooms directly there.
    el.addEventListener('wheel', function (e) {
      if (isFullscreen || e.ctrlKey || e.metaKey) {
        e.preventDefault();
        map.scrollWheelZoom.enable();
      } else {
        map.scrollWheelZoom.disable();
      }
    }, { passive: false });

    var esc = function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };

    function popupHtml(p) {
      var h = '<div class="place-popup">';
      h += '<strong>' + esc(p.name) + '</strong>';
      if (p.city) h += '<span class="place-popup-loc">' + esc(p.city) + (p.state ? ', ' + esc(p.state) : '') + '</span>';
      if (p.type) h += '<span class="place-popup-type">' + esc(p.type.replace(/-/g, ' ')) + '</span>';
      if (p.note) h += '<p>' + esc(p.note) + '</p>';

      var badges = [];
      (p.sources || []).forEach(function (s) {
        if (s === 'wisconsin-foodie') {
          var label = 'Wisconsin Foodie' + (p.wf_episode ? ' · ' + esc(p.wf_episode) : '');
          badges.push(p.wf_video
            ? '<a href="' + esc(p.wf_video) + '" target="_blank" rel="noopener">' + label + '</a>'
            : label);
        } else if (s === 'top-chef') {
          var tcResult = p.tc_result && p.tc_result !== 'contestant' ? ' (' + esc(p.tc_result) + ')' : '';
          badges.push('Top Chef' + (p.tc_season ? ' S' + esc(p.tc_season) : '') + (p.tc_contestant ? ' · ' + esc(p.tc_contestant) : '') + tcResult);
        } else if (s === 'james-beard') {
          badges.push('James Beard' + (p.jb_result ? ' ' + esc(p.jb_result) : '') + (p.jb_year ? ' ' + esc(p.jb_year) : '') + (p.jb_award ? ' · ' + esc(p.jb_award) : ''));
        } else {
          badges.push(esc(SOURCE_LABELS[s] || s));
        }
      });
      if (badges.length) h += '<ul class="place-popup-sources"><li>' + badges.join('</li><li>') + '</li></ul>';
      if (p.status === 'closed') h += '<span class="place-popup-closed">permanently closed</span>';
      h += '</div>';
      return h;
    }

    // A place with no sources belongs to the implicit "personal" bucket.
    function sourcesOf(p) {
      return (p.sources && p.sources.length) ? p.sources : ['personal'];
    }

    // Pin fill comes straight from the place's `color` frontmatter (a
    // design-system hue name or a literal color); no color rules live here.
    // Places without one fall back to the brand accent.
    function fillFor(p) {
      return p.color ? resolveColor(p.color) : token('--accent');
    }

    var markers = [];   // { marker, sources, latlng, place }
    var bounds = [];
    places.forEach(function (p) {
      if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return;
      var m = L.circleMarker([p.lat, p.lng], markerStyle(fillFor(p))).addTo(map).bindPopup(popupHtml(p));
      markers.push({ marker: m, sources: sourcesOf(p), latlng: [p.lat, p.lng], place: p });
      bounds.push([p.lat, p.lng]);
    });

    // Frame the dense cluster, not the outliers — one far-away pin (a Georgia
    // peach farm) shouldn't zoom the whole map out to half the country. Median
    // center, then keep pins within ~4° (~450km); the rest are reachable by
    // panning/zooming out.
    if (bounds.length > 1) {
      var lats = bounds.map(function (b) { return b[0]; }).sort(function (a, b) { return a - b; });
      var lngs = bounds.map(function (b) { return b[1]; }).sort(function (a, b) { return a - b; });
      var mid = [lats[Math.floor(lats.length / 2)], lngs[Math.floor(lngs.length / 2)]];
      var core = bounds.filter(function (b) {
        return Math.abs(b[0] - mid[0]) < 4 && Math.abs(b[1] - mid[1]) < 5;
      });
      map.fitBounds(core.length > 1 ? core : bounds, { padding: [40, 40], maxZoom: DEFAULT_ZOOM_CAP });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], DEFAULT_ZOOM_CAP);
    }

    // Restyle markers and swap tiles when the theme flips (theme.js toggles
    // data-theme on <html>).
    new MutationObserver(function () {
      markers.forEach(function (e) { e.marker.setStyle(markerStyle(fillFor(e.place))); });
      setTileTheme(document.documentElement.getAttribute('data-theme') === 'dark');
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // ---- Source filter bar ----
    var present = [];
    markers.forEach(function (e) {
      e.sources.forEach(function (s) {
        if (present.indexOf(s) === -1) present.push(s);
      });
    });
    // Stable order: known sources first, then anything new, personal last.
    var order = ['wisconsin-foodie', 'top-chef', 'james-beard'];
    present.sort(function (a, b) {
      var pa = a === 'personal' ? 99 : (order.indexOf(a) + 1 || 50);
      var pb = b === 'personal' ? 99 : (order.indexOf(b) + 1 || 50);
      return pa - pb;
    });
    if (present.length < 2) return; // nothing to filter

    // Most common `color` among a source's places — drives its legend dot.
    function dominantColor(source) {
      var counts = {}, best = null, n = 0;
      markers.forEach(function (e) {
        if (e.sources.indexOf(source) === -1 || !e.place.color) return;
        var c = String(e.place.color).toLowerCase().trim();
        counts[c] = (counts[c] || 0) + 1;
        if (counts[c] > n) { n = counts[c]; best = c; }
      });
      return best;
    }

    var enabled = {};
    var bar = document.createElement('div');
    bar.className = 'places-filters';
    present.forEach(function (s) {
      enabled[s] = true;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'places-filter is-on';
      btn.textContent = SOURCE_LABELS[s] || s.replace(/-/g, ' ');
      btn.setAttribute('aria-pressed', 'true');
      // Color key: a dot in this category's dominant pin color, read from the
      // data (no source→color rule here — the frontmatter decides). Set as a
      // var() when it's a design-system hue so it swaps on theme flip.
      var dom = dominantColor(s);
      if (dom) {
        btn.style.setProperty('--dot', colorVar(dom));
        btn.classList.add('has-dot');
      }
      btn.addEventListener('click', function () {
        enabled[s] = !enabled[s];
        btn.classList.toggle('is-on', enabled[s]);
        btn.setAttribute('aria-pressed', String(enabled[s]));
        markers.forEach(function (e) {
          var show = e.sources.some(function (src) { return enabled[src]; });
          if (show && !map.hasLayer(e.marker)) e.marker.addTo(map);
          if (!show && map.hasLayer(e.marker)) map.removeLayer(e.marker);
        });
        if (typeof umami !== 'undefined') {
          umami.track('Places filter', { source: s, on: enabled[s] });
        }
      });
      bar.appendChild(btn);
    });
    var title = document.createElement('h2');
    title.className = 'places-categories-title';
    title.textContent = 'Categories';
    el.parentNode.insertBefore(title, el);
    el.parentNode.insertBefore(bar, el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
