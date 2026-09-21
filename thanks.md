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
  function, with ?session_id=…). cart.js empties the cart when it sees that
  parameter; the copy is static because the receipt itself comes from Stripe.
  PLACEHOLDER copy — say it however you'd say it.
{%- endcomment -%}

<div class="thanks-page" data-thanks-page>
  <p class="thanks-lede">Your order is in. Stripe is emailing the receipt now, and the shipping notice will follow from me.</p>
  <a href="{{ '/#archive' | relative_url }}" class="btn">Back to the archive →</a>
</div>
