# Generates redirect stubs for the display-only breadcrumb paths.
#
# The wordmark shows sub-pages as a nested crumb (humancrafted.co/re/<slug>),
# but the real URLs are flat (/<slug>/). Without these stubs, typing or sharing
# the crumb path would 404. This generator mirrors every content page to a
# /re/<slug>/ redirect that points back to the real URL — so the displayed path
# resolves too. It runs on every build, so the redirects always match what
# exists (add a page -> its redirect appears; remove one -> it disappears).
#
# Keyed on the page's URL slug. If two pages ever share a slug it warns and
# keeps the first (slugs are the flat URLs, so they're unique today).
module CoReRedirects
  REDIRECT_TEMPLATE = <<~HTML
    <!DOCTYPE html>
    <html lang="en-US">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="refresh" content="0; url=%{target}">
      <link rel="canonical" href="%{canonical}">
      <meta name="robots" content="noindex">
      <title>Redirecting&hellip;</title>
      <script>location.replace("%{target}" + window.location.hash);</script>
    </head>
    <body>
      <p>Redirecting to <a href="%{target}">%{target}</a>&hellip;</p>
    </body>
    </html>
  HTML

  # A generated page with no source file, written to /re/<slug>/index.html.
  class RedirectPage < Jekyll::PageWithoutAFile
    def initialize(site, permalink, html)
      super(site, site.source, "", "index.html")
      data["permalink"] = permalink
      data["sitemap"]   = false # keep stubs out of the sitemap
      data["layout"]    = nil   # raw HTML — no nav/wordmark wrapper
      self.content = html
    end
  end

  class Generator < Jekyll::Generator
    safe true
    priority :low

    # Pages the wordmark does NOT render as a /re/<slug> sub-crumb.
    HUBS = ["/", "/lab/", "/re/", "/ops/"].freeze

    def generate(site)
      baseurl  = site.config["baseurl"].to_s
      site_url = site.config["url"].to_s
      seen  = {}
      count = 0

      # Standalone HTML pages (site.html_pages isn't available across Jekyll versions).
      html_pages = site.pages.select { |p| p.output_ext == ".html" }
      # Only collections that actually output pages — skip output:false ones
      # (music/dog/nutrition), whose docs have URLs but produce no real page.
      docs = site.documents.select { |d| d.collection.write? }

      (docs + html_pages).each do |doc|
        url = doc.url
        next if url.nil? || url.empty?
        next if HUBS.include?(url)
        next if url.start_with?("/re/")

        # Standalone pages: only real titled content (skip 404, utility pages).
        if html_pages.include?(doc)
          title = doc.data["title"]
          next if title.nil? || title.to_s.strip.empty?
        end

        # Match the wordmark's slug: last path segment, sans .html.
        slug = url.sub(/\.html\z/, "").split("/").reject(&:empty?).last
        next if slug.nil? || slug.empty?
        next if slug == "404"

        if seen.key?(slug)
          Jekyll.logger.warn "co/re redirects:",
            "slug '#{slug}' already maps to #{seen[slug]}; skipping #{url}"
          next
        end
        seen[slug] = url

        html = format(
          REDIRECT_TEMPLATE,
          target:    "#{baseurl}#{url}",
          canonical: "#{site_url}#{baseurl}#{url}"
        )
        site.pages << RedirectPage.new(site, "/re/#{slug}/", html)
        count += 1
      end

      Jekyll.logger.info "co/re redirects:",
        "generated #{count} /re/<slug>/ redirect#{"s" unless count == 1}"
    end
  end
end
