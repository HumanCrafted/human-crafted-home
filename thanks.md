---
layout: default
title: Thank you
crumb: thanks
permalink: /thanks/
shop: true
shop_page: true   # withheld entirely when shop_enabled is false
sitemap: false
---

{%- comment -%}
  Stripe sends the shopper here after paying (success_url on the checkout
  function, with ?order=HC-…&session_id=…). cart.js empties the cart when it
  sees session_id, and fills in the order number line from ?order= (it stays
  hidden without one). The same number heads the Stripe receipt email.
  PLACEHOLDER copy — say it however you'd say it.
{%- endcomment -%}

<div class="thanks-page" data-thanks-page>
  <p class="thanks-lede">Your order is in. Stripe is emailing the receipt now, and the shipping notice will follow from me.</p>
  <p class="thanks-order" data-thanks-order hidden>Your order number is <strong data-order-number></strong>.</p>
  <a href="{{ '/#projects' | relative_url }}" class="btn">Back to projects →</a>
</div>
