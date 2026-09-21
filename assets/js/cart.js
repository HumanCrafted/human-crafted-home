// Shop — cart, checkout and confirmation.
//
// The whole shop is static. There is no product collection: a project note in
// _projects/ joins the shop by carrying `shop_status:`, `price:` and
// `variants:` in its front matter, the build emits /catalog.json from those,
// and this file holds the cart in localStorage. The only thing ever sent
// anywhere is the cart itself — SKUs and quantities — to the checkout function
// (PATHS.checkout, the hcd-checkout repo), which re-prices it against the same
// /catalog.json and hands back a Stripe Checkout URL. Stripe's hosted page does
// address, shipping, payment and tax; it returns the shopper to /thanks/.
//
// Money is handled in integer cents everywhere and only formatted at the edges.
(function () {
  'use strict';

  var PATHS = window.HC_SHOP_PATHS || {};
  var KEY = 'hc-cart-v1';
  // The shipping region picked on /cart/, remembered between visits.
  var REGION_KEY = 'hc-region';

  // ---------------------------------------------------------------- storage

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed.items) ? parsed.items : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: 1, items: items }));
    } catch (e) { /* private mode — cart just won't persist */ }
    document.dispatchEvent(new CustomEvent('hc:cart-changed'));
  }

  function count() {
    return read().reduce(function (n, i) { return n + i.qty; }, 0);
  }

  function subtotalCents(items) {
    return items.reduce(function (n, i) { return n + cents(i.price) * i.qty; }, 0);
  }

  function cents(dollars) { return Math.round(Number(dollars) * 100); }

  function money(c, symbol) {
    return (symbol || '$') + (c / 100).toFixed(2);
  }

  function add(item) {
    var items = read();
    var found = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].sku === item.sku) { found = items[i]; break; }
    }
    if (found) {
      found.qty += item.qty;
      if (item.max != null) found.qty = Math.min(found.qty, item.max);
    } else {
      items.push(item);
    }
    write(items);
  }

  function setQty(sku, qty) {
    var items = read().map(function (i) {
      if (i.sku === sku) i.qty = Math.max(0, qty);
      return i;
    }).filter(function (i) { return i.qty > 0; });
    write(items);
  }

  function remove(sku) { setQty(sku, 0); }

  // ---------------------------------------------------------------- catalog

  var catalogPromise = null;

  function catalog() {
    if (!catalogPromise) {
      catalogPromise = fetch(PATHS.catalog, { cache: 'no-store' })
        .then(function (r) {
          if (!r.ok) throw new Error('catalog ' + r.status);
          return r.json();
        });
    }
    return catalogPromise;
  }

  function findVariant(cat, sku) {
    for (var p = 0; p < cat.products.length; p++) {
      var prod = cat.products[p];
      for (var v = 0; v < prod.variants.length; v++) {
        if (prod.variants[v].sku === sku) return { product: prod, variant: prod.variants[v] };
      }
    }
    return null;
  }

  // Re-check a localStorage cart against the catalog that shipped with THIS
  // build: prices, titles and stock may all have moved since the item was
  // added. Returns { items, notices } — notices are shown to the shopper so a
  // silently-shrunk cart never surprises them at checkout.
  function reconcile(cat) {
    var items = read();
    var notices = [];
    var kept = [];

    items.forEach(function (item) {
      var hit = findVariant(cat, item.sku);
      if (!hit || hit.product.status === 'archived') {
        notices.push('“' + item.title + '” is no longer available and was removed.');
        return;
      }
      var isDigital = hit.product.type === 'digital';
      var stock = hit.variant.stock;

      if (!isDigital && stock === 0) {
        notices.push('“' + item.title + ' — ' + item.variant + '” sold out and was removed.');
        return;
      }
      if (cents(hit.variant.price) !== cents(item.price)) {
        notices.push('The price of “' + item.title + '” changed to ' +
          money(cents(hit.variant.price), cat.settings.symbol) + '.');
      }
      if (!isDigital && item.qty > stock) {
        notices.push('Only ' + stock + ' of “' + item.title + ' — ' + item.variant + '” left; quantity reduced.');
        item.qty = stock;
      }
      if (isDigital && item.qty !== 1) item.qty = 1;

      item.price = hit.variant.price;
      item.title = hit.product.title;
      item.variant = hit.variant.name;
      item.url = hit.product.url;
      item.image = hit.product.image;
      item.type = hit.product.type;
      item.max = isDigital ? 1 : stock;
      kept.push(item);
    });

    if (notices.length || kept.length !== items.length) write(kept);
    return { items: kept, notices: notices };
  }

  // ---------------------------------------------------------------- totals

  function shippingFor(items, cat, regionCode) {
    var physical = items.some(function (i) { return i.type !== 'digital'; });
    if (!physical) return { cents: 0, label: 'No shipping — download' };

    var sub = subtotalCents(items);
    var threshold = cents(cat.settings.free_shipping_over || 0);
    if (threshold && sub >= threshold) return { cents: 0, label: 'Free over ' + money(threshold, cat.settings.symbol) };

    var region = cat.shipping.filter(function (s) { return s.code === regionCode; })[0];
    if (!region) return { cents: 0, label: 'Select a region' , unset: true };
    return { cents: cents(region.rate), label: region.region + ' — ' + region.note };
  }

  // Tax isn't estimated here — Stripe calculates it from the address it
  // collects, so the cart only ever says "at checkout".
  function totals(items, cat, regionCode) {
    var sub = subtotalCents(items);
    var ship = shippingFor(items, cat, regionCode);
    return {
      subtotal: sub,
      shipping: ship,
      total: sub + ship.cents
    };
  }

  function readRegion(cat) {
    var saved = null;
    try { saved = localStorage.getItem(REGION_KEY); } catch (e) {}
    var known = cat.shipping.some(function (s) { return s.code === saved; });
    if (known) return saved;
    return cat.shipping.length ? cat.shipping[0].code : null;
  }

  function writeRegion(code) {
    try { localStorage.setItem(REGION_KEY, code); } catch (e) {}
  }

  // ---------------------------------------------------------------- badge

  function updateBadge() {
    var n = count();
    document.querySelectorAll('[data-cart-badge]').forEach(function (el) {
      el.textContent = n;
      el.closest('.cart-link').classList.toggle('is-empty', n === 0);
    });
  }

  // ---------------------------------------------------------------- drawer

  function drawer() { return document.querySelector('[data-cart-drawer]'); }

  function openDrawer() {
    var d = drawer();
    if (!d) return;
    renderDrawer();
    d.classList.add('is-open');
    d.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var close = d.querySelector('.cart-drawer-close');
    if (close) close.focus();
  }

  function closeDrawer() {
    var d = drawer();
    if (!d) return;
    d.classList.remove('is-open');
    d.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderDrawer() {
    var d = drawer();
    if (!d) return;
    var body = d.querySelector('[data-cart-drawer-body]');
    var foot = d.querySelector('[data-cart-drawer-foot]');
    var items = read();

    if (!items.length) {
      body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      foot.innerHTML = '<a class="btn" href="' + PATHS.shop + '">Browse the archive →</a>';
      return;
    }

    body.innerHTML = items.map(function (i) {
      return '' +
        '<div class="cart-line">' +
          '<a class="cart-line-image" href="' + i.url + '"><img src="' + i.image + '" alt=""></a>' +
          '<div class="cart-line-body">' +
            '<a class="cart-line-title" href="' + i.url + '">' + esc(i.title) + '</a>' +
            '<p class="cart-line-variant">' + esc(i.variant) + '</p>' +
            '<div class="cart-line-controls">' +
              qtyControl(i) +
              '<span class="cart-line-price">' + money(cents(i.price) * i.qty) + '</span>' +
            '</div>' +
          '</div>' +
          '<button class="cart-line-remove" type="button" data-remove="' + esc(i.sku) + '" aria-label="Remove ' + esc(i.title) + '">×</button>' +
        '</div>';
    }).join('');

    foot.innerHTML = '' +
      '<div class="cart-subtotal"><span>Subtotal</span><span>' + money(subtotalCents(items)) + '</span></div>' +
      '<p class="cart-fineprint">Shipping and tax calculated at checkout.</p>' +
      '<a class="btn cart-checkout-btn" href="' + PATHS.cart + '">View cart &amp; check out →</a>';
  }

  function qtyControl(i) {
    if (i.type === 'digital') return '<span class="cart-line-qty-fixed">Digital</span>';
    return '' +
      '<span class="qty-stepper qty-stepper--sm">' +
        '<button type="button" class="qty-btn" data-qty="' + esc(i.sku) + '" data-step="-1" aria-label="Decrease">−</button>' +
        '<span class="qty-value">' + i.qty + '</span>' +
        '<button type="button" class="qty-btn" data-qty="' + esc(i.sku) + '" data-step="1" aria-label="Increase"' +
          (i.max != null && i.qty >= i.max ? ' disabled' : '') + '>+</button>' +
      '</span>';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---------------------------------------------------------------- product page

  function initProductForm() {
    var form = document.querySelector('.product-form');
    if (!form) return;

    var priceEl = document.getElementById('product-price');
    var stockEl = document.getElementById('product-stock');
    var qtyInput = form.querySelector('.qty-input');
    var lowAt = stockEl ? Number(stockEl.dataset.lowAt || 5) : 5;

    function selected() {
      return form.querySelector('input[name="variant"]:checked');
    }

    function sync() {
      var v = selected();
      if (!v) return;
      var stock = Number(v.dataset.stock);
      if (priceEl) priceEl.textContent = money(cents(v.dataset.price));

      if (stockEl) {
        if (form.dataset.type === 'digital') {
          stockEl.textContent = 'Instant download';
          stockEl.className = 'product-stock is-digital';
        } else if (stock <= lowAt) {
          stockEl.textContent = 'Only ' + stock + ' left';
          stockEl.className = 'product-stock is-low';
        } else {
          stockEl.textContent = stock + ' in stock';
          stockEl.className = 'product-stock';
        }
      }
      if (qtyInput) {
        qtyInput.max = stock;
        if (Number(qtyInput.value) > stock) qtyInput.value = stock;
      }
    }

    form.addEventListener('change', sync);

    form.querySelectorAll('.qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!qtyInput) return;
        var max = Number(qtyInput.max || 99);
        var next = Number(qtyInput.value) + Number(btn.dataset.step);
        qtyInput.value = Math.min(max, Math.max(1, next));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = selected();
      if (!v) return;
      var isDigital = form.dataset.type === 'digital';
      var stock = Number(v.dataset.stock);
      var qty = isDigital ? 1 : Math.max(1, Number(qtyInput ? qtyInput.value : 1));

      add({
        sku: v.value,
        slug: form.dataset.product,
        title: form.dataset.title,
        variant: v.dataset.name,
        price: Number(v.dataset.price),
        image: form.dataset.image,
        url: form.dataset.url,
        type: isDigital ? 'digital' : 'physical',
        qty: qty,
        max: isDigital ? 1 : stock
      });
      openDrawer();
    });

    // Gallery thumbs
    var hero = document.getElementById('product-hero');
    document.querySelectorAll('.product-thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        if (hero) hero.src = t.dataset.src;
        document.querySelectorAll('.product-thumb').forEach(function (o) { o.classList.remove('is-active'); });
        t.classList.add('is-active');
      });
    });

    sync();
  }

  // ---------------------------------------------------------------- cart page

  function initCartPage() {
    var root = document.querySelector('[data-cart-page]');
    if (!root) return;

    catalog().then(function (cat) {
      function render() {
        var state = reconcile(cat);
        var items = state.items;

        if (!items.length) {
          // Keep the notices above the empty state: if reconcile just removed
          // the last line (archived, sold out), an unexplained empty cart reads
          // as a bug. The shopper needs to know what went and why.
          root.innerHTML =
            noticesHtml(state.notices) +
            '<div class="cart-empty-state">' +
              '<p>Your cart is empty.</p>' +
              '<a class="btn" href="' + PATHS.shop + '">Browse the archive →</a>' +
            '</div>';
          return;
        }

        var physical = items.some(function (i) { return i.type !== 'digital'; });
        var region = physical ? readRegion(cat) : null;
        var t = totals(items, cat, region);
        root.innerHTML = '' +
          noticesHtml(state.notices) +
          '<div class="cart-grid">' +
            '<div class="cart-lines">' +
              items.map(function (i) {
                return '' +
                  '<div class="cart-line cart-line--lg">' +
                    '<a class="cart-line-image" href="' + i.url + '"><img src="' + i.image + '" alt=""></a>' +
                    '<div class="cart-line-body">' +
                      '<a class="cart-line-title" href="' + i.url + '">' + esc(i.title) + '</a>' +
                      '<p class="cart-line-variant">' + esc(i.variant) + '</p>' +
                      '<div class="cart-line-controls">' +
                        qtyControl(i) +
                        '<span class="cart-line-price">' + money(cents(i.price) * i.qty, cat.settings.symbol) + '</span>' +
                      '</div>' +
                    '</div>' +
                    '<button class="cart-line-remove" type="button" data-remove="' + esc(i.sku) + '" aria-label="Remove">×</button>' +
                  '</div>';
              }).join('') +
            '</div>' +
            '<aside class="cart-summary">' +
              '<h2>Summary</h2>' +
              row('Subtotal', money(t.subtotal, cat.settings.symbol)) +
              (physical ? regionPicker(cat, region) : '') +
              row('Shipping', t.shipping.cents === 0 ? esc(t.shipping.label) : money(t.shipping.cents, cat.settings.symbol)) +
              row('Tax', 'At checkout') +
              row('Total', money(t.total, cat.settings.symbol) + (physical ? ' + tax' : ''), 'summary-row--total') +
              '<button type="button" class="btn cart-checkout-btn" data-checkout data-umami-event="Checkout start">Check out →</button>' +
              '<p class="cart-fineprint cart-fineprint--center">Address and payment on Stripe’s secure page.</p>' +
              '<a class="cart-keep" href="' + PATHS.shop + '">or keep looking</a>' +
            '</aside>' +
          '</div>';
      }

      render();
      document.addEventListener('hc:cart-changed', render);

      root.addEventListener('change', function (e) {
        var sel = e.target.closest('[data-region]');
        if (!sel) return;
        writeRegion(sel.value);
        render();
      });

      root.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-checkout]');
        if (!btn) return;
        var sel = root.querySelector('[data-region]');
        startCheckout(cat, sel ? sel.value : null, btn, root);
      });
    }).catch(function () {
      root.innerHTML = '<p class="cart-error">Couldn’t load the catalog. Reload the page?</p>';
    });
  }

  function row(label, value, cls) {
    return '<div class="summary-row' + (cls ? ' ' + cls : '') + '"><span>' + label + '</span><span>' + value + '</span></div>';
  }

  function noticesHtml(notices) {
    if (!notices.length) return '';
    return '<ul class="cart-notices">' +
      notices.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>';
  }

  function regionPicker(cat, current) {
    return '<div class="cart-region">' +
      '<label for="cart-region">Ship to</label>' +
      '<select id="cart-region" data-region>' +
        cat.shipping.map(function (s) {
          return '<option value="' + esc(s.code) + '"' + (s.code === current ? ' selected' : '') + '>' +
            esc(s.region) + ' · ' + esc(s.note) + '</option>';
        }).join('') +
      '</select>' +
    '</div>';
  }

  // ---------------------------------------------------------------- checkout
  //
  // The seam. Post the cart — SKUs and quantities only — to the checkout
  // function and go wherever it says. It re-prices everything against
  // /catalog.json, so nothing here decides what gets charged. A 400 comes back
  // with shopper-facing notices (sold out, stale, over stock) which are shown
  // above the cart, same place reconcile() puts its own.

  function startCheckout(cat, regionCode, button, root) {
    var items = read();
    if (!items.length || button.disabled) return;

    var label = button.textContent;
    button.disabled = true;
    button.textContent = 'Opening checkout…';

    var payload = {
      items: items.map(function (i) { return { sku: i.sku, qty: i.qty }; }),
      region: regionCode
    };

    fetch(PATHS.checkout, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().then(function (data) { return { ok: r.ok, data: data }; },
                           function () { return { ok: false, data: {} }; });
    }).then(function (res) {
      if (res.ok && res.data.url) {
        window.location.href = res.data.url;
        return;
      }
      var lines = (res.data.notices && res.data.notices.length)
        ? res.data.notices
        : [res.data.error || 'Couldn’t reach checkout. Try again in a moment.'];
      showCheckoutNotices(root, lines);
      button.disabled = false;
      button.textContent = label;
    }).catch(function () {
      showCheckoutNotices(root, ['Couldn’t reach checkout. Check your connection and try again.']);
      button.disabled = false;
      button.textContent = label;
    });
  }

  function showCheckoutNotices(root, lines) {
    var old = root.querySelector('.cart-notices');
    if (old) old.remove();
    root.insertAdjacentHTML('afterbegin', noticesHtml(lines));
    var el = root.querySelector('.cart-notices');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  // ---------------------------------------------------------------- thanks
  //
  // Stripe's success_url is /thanks/?session_id=… — arriving with that
  // parameter means the payment went through, so the cart is done. The page
  // copy itself is static (thanks.md); the receipt comes from Stripe.

  function initThanks() {
    var root = document.querySelector('[data-thanks-page]');
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    if (!params.get('session_id')) return;

    write([]);
    // Drop the id from the address bar so a reload or a shared link doesn't
    // carry it around.
    try { history.replaceState(null, '', window.location.pathname); } catch (e) {}
  }

  // ---------------------------------------------------------------- events

  function initGlobal() {
    document.addEventListener('click', function (e) {
      var openBtn = e.target.closest('[data-cart-open]');
      if (openBtn) { e.preventDefault(); openDrawer(); return; }

      if (e.target.closest('.cart-drawer-close') || e.target.closest('[data-cart-backdrop]')) {
        closeDrawer(); return;
      }

      var rm = e.target.closest('[data-remove]');
      if (rm) { remove(rm.dataset.remove); return; }

      var q = e.target.closest('[data-qty]');
      if (q) {
        var items = read();
        var cur = items.filter(function (i) { return i.sku === q.dataset.qty; })[0];
        if (!cur) return;
        var next = cur.qty + Number(q.dataset.step);
        if (cur.max != null) next = Math.min(next, cur.max);
        setQty(cur.sku, next);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });

    document.addEventListener('hc:cart-changed', function () {
      updateBadge();
      var d = drawer();
      if (d && d.classList.contains('is-open')) renderDrawer();
    });

    // A second tab changed the cart.
    window.addEventListener('storage', function (e) {
      if (e.key === KEY) updateBadge();
    });

    updateBadge();
  }

  function boot() {
    initGlobal();
    initProductForm();
    initCartPage();
    initThanks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
