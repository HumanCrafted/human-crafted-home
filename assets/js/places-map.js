/**
 * Places map — renders the _places collection on a Leaflet map.
 * Data comes from #places-data (JSON emitted by _includes/places-data.html).
 * Tiles are Carto Positron (minimal, near-greyscale) tinted toward the paper
 * tone in CSS; markers are circleMarkers colored from the design tokens, so
 * theme switches restyle them live (see the data-theme MutationObserver).
 */
(function () {
  'use strict';

  var SOURCE_LABELS = {
    'wisconsin-foodie': 'Wisconsin Foodie',
    'top-chef': 'Top Chef',
    'james-beard': 'James Beard',
    'personal': 'personal'
  };

  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function markerStyle() {
    return {
      radius: 7,
      fillColor: token('--accent'),
      color: token('--foreground'),
      weight: 1.5,
      fillOpacity: 0.9
    };
  }

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

    var map = L.map(el, { scrollWheelZoom: false }).setView([44.6, -89.8], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // Match the STL viewer's convention: plain page scroll is never hijacked —
    // zoom needs ctrl/meta (what a trackpad pinch sends) or the +/- controls.
    el.addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.metaKey) {
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
          badges.push('Top Chef' + (p.tc_season ? ' S' + esc(p.tc_season) : '') + (p.tc_contestant ? ' · ' + esc(p.tc_contestant) : ''));
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

    var markers = [];   // { marker, sources, latlng }
    var bounds = [];
    places.forEach(function (p) {
      if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return;
      var m = L.circleMarker([p.lat, p.lng], markerStyle()).addTo(map).bindPopup(popupHtml(p));
      markers.push({ marker: m, sources: sourcesOf(p), latlng: [p.lat, p.lng] });
      bounds.push([p.lat, p.lng]);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 11);
    }

    // Restyle markers when the theme flips (theme.js toggles data-theme on <html>).
    new MutationObserver(function () {
      var style = markerStyle();
      markers.forEach(function (e) { e.marker.setStyle(style); });
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
    el.parentNode.insertBefore(bar, el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
