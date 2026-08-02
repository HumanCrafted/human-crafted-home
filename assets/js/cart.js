// Shop — cart, checkout and confirmation.
//
// The whole shop is static. There is no product collection: a project note in
// _projects/ joins the shop by carrying `shop_status:`, `price:` and
// `variants:` in its front matter, the build emits /catalog.json from those,
// and this file holds the cart in localStorage. Nothing is sent anywhere.
// `placeOrder` deliberately stops at a receipt — swapping in a real processor
// means replacing that one function (see PLACE ORDER below) and nothing else.
//
// Money is handled in integer cents everywhere and only formatted at the edges.
(function () {
  'use strict';

  var PATHS = window.HC_SHOP_PATHS || {};
  var KEY = 'hc-cart-v1';
  var ORDER_KEY = 'hc-last-order';

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

  function totals(items, cat, regionCode) {
    var sub = subtotalCents(items);
    var ship = shippingFor(items, cat, regionCode);
    var tax = Math.round(sub * Number(cat.settings.tax_rate || 0));
    return {
      subtotal: sub,
      shipping: ship,
      tax: tax,
      total: sub + ship.cents + tax
    };
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

        var t = totals(items, cat, null);
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
              row('Shipping', t.shipping.unset ? 'At checkout' : money(t.shipping.cents, cat.settings.symbol)) +
              row('Tax', 'At checkout') +
              '<a class="btn cart-checkout-btn" href="' + PATHS.checkout + '">Check out →</a>' +
              '<a class="cart-keep" href="' + PATHS.shop + '">or keep looking</a>' +
            '</aside>' +
          '</div>';
      }

      render();
      document.addEventListener('hc:cart-changed', render);
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

  // ---------------------------------------------------------------- checkout

  function initCheckout() {
    var root = document.querySelector('[data-checkout-page]');
    if (!root) return;

    catalog().then(function (cat) {
      var state = reconcile(cat);
      if (!state.items.length) {
        root.innerHTML =
          '<div class="cart-empty-state"><p>Nothing to check out.</p>' +
          '<a class="btn" href="' + PATHS.shop + '">Browse the archive →</a></div>';
        return;
      }

      var physical = state.items.some(function (i) { return i.type !== 'digital'; });

      root.innerHTML = '' +
        noticesHtml(state.notices) +
        '<form class="checkout-grid" id="checkout-form" novalidate>' +
          '<div class="checkout-fields">' +
            '<h2>Contact</h2>' +
            field('email', 'Email', 'email', 'you@example.com', true) +
            (physical ? '' +
              '<h2>Ship to</h2>' +
              field('name', 'Full name', 'text', '', true) +
              field('address1', 'Address', 'text', '', true) +
              field('address2', 'Apartment, suite (optional)', 'text', '', false) +
              '<div class="field-row">' +
                field('city', 'City', 'text', '', true) +
                field('state', 'State / Province', 'text', '', true) +
                field('zip', 'Postal code', 'text', '', true) +
              '</div>' +
              '<div class="field">' +
                '<label for="region">Region</label>' +
                '<select id="region" name="region" required>' +
                  cat.shipping.map(function (s) {
                    return '<option value="' + s.code + '">' + esc(s.region) + ' — ' +
                      money(cents(s.rate), cat.settings.symbol) + ' · ' + esc(s.note) + '</option>';
                  }).join('') +
                '</select>' +
              '</div>'
              : '<p class="checkout-digital-note">Digital order — files are delivered to the email above, no address needed.</p>') +
            '<h2>Payment</h2>' +
            '<div class="checkout-payment-stub">' +
              '<p>This is where the payment step goes. Nothing is collected here and no card fields exist on purpose.</p>' +
            '</div>' +
          '</div>' +

          '<aside class="checkout-summary" id="checkout-summary"></aside>' +
        '</form>';

      var form = document.getElementById('checkout-form');
      var summary = document.getElementById('checkout-summary');
      var regionSel = form.querySelector('#region');

      function renderSummary() {
        var items = read();
        var code = regionSel ? regionSel.value : null;
        var t = totals(items, cat, code);

        summary.innerHTML = '' +
          '<h2>Order</h2>' +
          '<div class="checkout-lines">' +
            items.map(function (i) {
              return '<div class="checkout-line">' +
                '<img src="' + i.image + '" alt="">' +
                '<span class="checkout-line-name">' + esc(i.title) + '<em>' + esc(i.variant) + '</em></span>' +
                '<span class="checkout-line-qty">×' + i.qty + '</span>' +
                '<span class="checkout-line-price">' + money(cents(i.price) * i.qty, cat.settings.symbol) + '</span>' +
              '</div>';
            }).join('') +
          '</div>' +
          row('Subtotal', money(t.subtotal, cat.settings.symbol)) +
          row('Shipping', t.shipping.cents === 0 ? esc(t.shipping.label) : money(t.shipping.cents, cat.settings.symbol)) +
          row(esc(cat.settings.tax_note), money(t.tax, cat.settings.symbol)) +
          row('Total', money(t.total, cat.settings.symbol), 'summary-row--total') +
          '<button type="submit" class="btn checkout-place">Place order</button>' +
          '<p class="cart-fineprint">Prototype — no charge is made.</p>';
      }

      renderSummary();
      if (regionSel) regionSel.addEventListener('change', renderSummary);
      document.addEventListener('hc:cart-changed', renderSummary);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        placeOrder(form, cat, regionSel ? regionSel.value : null);
      });
    }).catch(function () {
      root.innerHTML = '<p class="cart-error">Couldn’t load the catalog. Reload the page?</p>';
    });
  }

  function field(name, label, type, placeholder, required) {
    return '<div class="field">' +
      '<label for="' + name + '">' + label + '</label>' +
      '<input id="' + name + '" name="' + name + '" type="' + type + '"' +
        (placeholder ? ' placeholder="' + placeholder + '"' : '') +
        (required ? ' required' : '') + '>' +
    '</div>';
  }

  // ---------------------------------------------------------------- PLACE ORDER
  //
  // The seam. Right now this writes a receipt to sessionStorage and forwards to
  // /made/thanks/. A real shop replaces the body of this function with a call
  // that hands `items` to a payment processor and redirects to its hosted page —
  // everything above stays exactly as it is.

  function placeOrder(form, cat, regionCode) {
    var missing = Array.prototype.filter.call(
      form.querySelectorAll('[required]'),
      function (el) { return !el.value.trim(); }
    );
    form.querySelectorAll('.field.has-error').forEach(function (f) { f.classList.remove('has-error'); });
    if (missing.length) {
      missing.forEach(function (el) {
        var f = el.closest('.field');
        if (f) f.classList.add('has-error');
      });
      missing[0].focus();
      return;
    }

    var items = read();
    var t = totals(items, cat, regionCode);
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    var order = {
      number: orderNumber(),
      placed: new Date().toISOString(),
      email: data.email,
      ship_to: data.name ? {
        name: data.name,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zip: data.zip
      } : null,
      region: regionCode,
      symbol: cat.settings.symbol,
      items: items,
      totals: {
        subtotal: t.subtotal,
        shipping: t.shipping.cents,
        shipping_label: t.shipping.label,
        tax: t.tax,
        tax_note: cat.settings.tax_note,
        total: t.total
      }
    };

    try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch (e) {}
    write([]);
    window.location.href = PATHS.thanks;
  }

  // HC-YYMMDD-XXXX. Fine for a prototype receipt; a real shop takes the
  // processor's order id instead.
  function orderNumber() {
    var d = new Date();
    var p = function (n) { return String(n).padStart(2, '0'); };
    var rand = Math.floor(1000 + Math.random() * 9000);
    return 'HC-' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + rand;
  }

  // ---------------------------------------------------------------- thanks

  function initThanks() {
    var root = document.querySelector('[data-thanks-page]');
    if (!root) return;

    var order = null;
    try { order = JSON.parse(sessionStorage.getItem(ORDER_KEY)); } catch (e) {}

    if (!order) {
      root.innerHTML =
        '<div class="cart-empty-state"><p>No recent order to show.</p>' +
        '<a class="btn" href="' + PATHS.shop + '">Browse the archive →</a></div>';
      return;
    }

    var s = order.symbol || '$';
    var digitalOnly = order.items.every(function (i) { return i.type === 'digital'; });

    root.innerHTML = '' +
      '<p class="thanks-lede">Order <strong>' + esc(order.number) + '</strong> is in. ' +
      'A confirmation would go to <strong>' + esc(order.email) + '</strong>.</p>' +
      '<p class="checkout-banner" role="note"><strong>Prototype.</strong> Nothing was charged and no order was actually placed.</p>' +

      '<div class="thanks-grid">' +
        '<div class="thanks-items">' +
          '<h2>What you ordered</h2>' +
          order.items.map(function (i) {
            return '<div class="checkout-line">' +
              '<img src="' + i.image + '" alt="">' +
              '<span class="checkout-line-name">' + esc(i.title) + '<em>' + esc(i.variant) + '</em></span>' +
              '<span class="checkout-line-qty">×' + i.qty + '</span>' +
              '<span class="checkout-line-price">' + money(cents(i.price) * i.qty, s) + '</span>' +
            '</div>';
          }).join('') +
          (digitalOnly
            ? '<p class="thanks-download">Your download links would appear here.</p>'
            : '') +
        '</div>' +

        '<aside class="thanks-summary">' +
          '<h2>Totals</h2>' +
          row('Subtotal', money(order.totals.subtotal, s)) +
          row('Shipping', order.totals.shipping === 0 ? esc(order.totals.shipping_label) : money(order.totals.shipping, s)) +
          row(esc(order.totals.tax_note), money(order.totals.tax, s)) +
          row('Total', money(order.totals.total, s), 'summary-row--total') +
          (order.ship_to ? '<h2>Shipping to</h2><address class="thanks-address">' +
            esc(order.ship_to.name) + '<br>' +
            esc(order.ship_to.address1) + '<br>' +
            (order.ship_to.address2 ? esc(order.ship_to.address2) + '<br>' : '') +
            esc(order.ship_to.city) + ', ' + esc(order.ship_to.state) + ' ' + esc(order.ship_to.zip) +
            '</address>' : '') +
          '<a class="btn" href="' + PATHS.shop + '">Back to the archive →</a>' +
        '</aside>' +
      '</div>';
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
    initCheckout();
    initThanks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
