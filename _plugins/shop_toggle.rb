# Enforces the `shop_enabled` kill switch in _config.yml.
#
# Guarding template OUTPUT isn't enough to hide the shop: cart.md, checkout.md,
# thanks.md and catalog.json would still be generated, still be reachable at
# their URLs, still land in sitemap.xml, and still get /re/<slug>/ redirect
# stubs. An empty page titled "Checkout" on the live domain is exactly the
# evidence the switch is supposed to suppress.
#
# So when the shop is off, drop those pages from the site entirely. Every file
# that exists only because of the shop carries `shop_page: true` in its front
# matter; that flag is the whole contract.
#
# Timing matters: this runs at :post_read, BEFORE generators. jekyll-sitemap and
# _plugins/co_re_redirects.rb are both generators, so neither ever sees the
# dropped pages — no sitemap entries, no redirect stubs. Registering this any
# later would leave both behind.
Jekyll::Hooks.register :site, :post_read do |site|
  next if site.config["shop_enabled"]

  dropped = site.pages.select { |p| p.data["shop_page"] }
  site.pages.reject! { |p| p.data["shop_page"] }

  # Static assets that exist only for the shop. Without this, cart.js is copied
  # into the build and readable at /assets/js/cart.js — it spells out the whole
  # shop, prices and checkout flow. shop.css likewise ships .buy-block and
  # .cart-drawer selectors to every visitor. Neither is referenced while the
  # shop is off, but "unreferenced" is not "absent".
  SHOP_ASSETS = %w[
    /assets/js/cart.js
    /assets/css/shop.css
  ].freeze

  assets = site.static_files.select { |f| SHOP_ASSETS.include?(f.url) }
  site.static_files.reject! { |f| SHOP_ASSETS.include?(f.url) }

  withheld = dropped.map { |p| p.data["permalink"] || p.name } + assets.map(&:url)
  next if withheld.empty?

  Jekyll.logger.info "shop:",
    "disabled (shop_enabled: false) — withheld #{withheld.size}: #{withheld.sort.join(", ")}"
end

# Rummage items (_rummage/) exist only to be sold, so unlike a project they
# have no page to fall back to once they're off sale. Drop every item when the
# shop is off, and otherwise any item whose `shop_status` isn't `available` or
# `archived` — the same allow-list as catalog.json and the project layout, so
# setting `shop_status: off` (or a typo) takes an item off the site entirely.
# Sold-out items (stock 0) are kept: they leave the /rummage/ grid but their
# page and catalog entry stay, so a cart still holding one is told it sold.
# Runs at :post_read, before generators, so the sitemap and the co/re redirect
# stubs never see a dropped item.
Jekyll::Hooks.register :site, :post_read do |site|
  rummage = site.collections["rummage"]
  next unless rummage

  live = %w[available archived]
  dropped = rummage.docs.reject do |d|
    site.config["shop_enabled"] && live.include?(d.data["shop_status"].to_s)
  end
  next if dropped.empty?

  rummage.docs.reject! { |d| dropped.include?(d) }
  Jekyll.logger.info "rummage:",
    "withheld #{dropped.size} item#{"s" unless dropped.size == 1} " \
    "(#{site.config["shop_enabled"] ? "not available" : "shop off"}): " \
    "#{dropped.map { |d| d.data["slug"] || d.basename_without_ext }.sort.join(", ")}"
end
