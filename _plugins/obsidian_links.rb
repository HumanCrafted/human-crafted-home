require "cgi"

# Obsidian -> Jekyll link & image conversion.
#
# ONE authoring convention (see CLAUDE.md "Linking convention"):
#   * Internal links : [[slug|Display Text]]   (or [[slug]])
#   * Images         : ![[file.ext]]           (files live in assets/images/)
#   * 3D models      : ![[file.stl]]           (files live in assets/models/)
#   * Do NOT hand-write [text](path.md) links. They're only converted here as a
#     best-effort fallback, and typing them in Obsidian can spawn phantom empty
#     notes that break the build.
#
# "slug" is the target note's filename without .md. Every project and doc maps
# 1:1 to its URL (/:slug/), so [[shop-v3]] -> /shop-v3/. The handful of hub
# pages whose permalink differs from their filename are aliased in
# PERMALINK_ALIASES below. Targets are slugified (lowercased, spaces/underscores
# -> hyphens), so [[Shop V3]] and [[shop_v3]] resolve the same as [[shop-v3]].
#
# Links inside `inline code` or ```fenced blocks``` are left untouched, so a doc
# can show literal [[slug]] / ![[img]] examples without them becoming live links.
module ObsidianLinks
  # Images embedded with ![[ ]] (by extension).
  IMAGE_RE      = /!\[\[([^\|\]]+\.(?:jpg|jpeg|png|gif|svg|webp))(?:\|([^\]]+))?\]\]/i
  # A line that is nothing but 2+ image embeds — a candidate image row; it
  # becomes one only if an embed carries column=N (see convert_image_rows).
  IMAGE_ROW_RE  = /^[ \t]*(?:!\[\[[^\|\]]+\.(?:jpg|jpeg|png|gif|svg|webp)(?:\|[^\]]+)?\]\][ \t]*){2,}$/i
  # 3D models embedded with ![[ ]] -> an interactive viewer. Everything after the
  # filename is captured as one blob and split on "|" in convert_models.
  MODEL_RE      = /!\[\[([^\|\]]+\.stl)((?:\|[^\|\]]*)*)\]\]/i
  # Options a model embed accepts, as key=value pipe segments. Each becomes a
  # data-<key> attribute; anything else is ignored rather than passed through.
  MODEL_OPTS    = %w[spin up].freeze
  # Options an image embed accepts, as key=value pipe segments (same pattern as
  # MODEL_OPTS). Values must be numeric. Short aliases are tolerated, but the
  # full words are the documented syntax.
  IMAGE_OPTS    = {
    "width"  => :width,  "w"   => :width,
    "column" => :column, "col" => :column, "c" => :column,
  }.freeze
  # Obsidian .base embeds -> Jekyll include.
  BASE_RE       = /!\[\[([^\]]+)\.base\]\]/
  # Wiki links: [[target|Display]] or [[target]] (not preceded by "!").
  WIKI_RE       = /(?<!!)\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]/
  # Fallback markdown links to a .md file: [Display](some/path.md).
  MD_LINK_RE    = /\[([^\]]+)\]\(([^)\s]+\.md)\)/
  # Private-use sentinel for masked code — never appears in content, matches no
  # link/image regex above.
  CODE_SENTINEL = ""

  # Pages whose URL is NOT "/#{filename}/". Keyed by slugified filename.
  PERMALINK_ALIASES = {
    "core"  => "/re/",  # core.md -> /re/
    "re"    => "/re/",
    "more"  => "/re/",  # legacy /more/ label, redirects to /re/
    "index" => "/",     # homepage
    "home"  => "/",
  }.freeze

  # Normalize a wiki-link target to a URL slug.
  def self.slugify(raw)
    CGI.unescape(raw.to_s.strip).downcase.gsub(/[\s_]+/, "-").gsub(/[^a-z0-9\-]/, "")
  end

  # Resolve any target (filename, slug, title, or path.md) to a site-root path,
  # e.g. "/shop-v3/". Honors PERMALINK_ALIASES.
  #
  # Posts live in _posts as YYYY-MM-DD-title.md but are served at /:slug/ (see
  # _config.yml). Obsidian resolves post links by that dated filename, so strip a
  # leading date prefix here — [[2016-06-30-made-better]] -> /made-better/ — so a
  # filename wiki-link (the form Obsidian creates and always resolves) still maps
  # to the post's real URL on the built site.
  def self.target_path(raw)
    base = raw.to_s.strip
              .sub(/[#?].*\z/, "")          # drop #anchor / ?query
              .sub(/\.md\z/i, "")           # drop .md
              .split("/").reject(&:empty?).last.to_s  # basename if a path slipped in
              .sub(/\A\d{4}-\d{2}-\d{2}-/, "")        # drop _posts date prefix
    slug = slugify(base)
    PERMALINK_ALIASES[slug] || "/#{slug}/"
  end

  # Convert a line of 2+ adjacent image embeds carrying a column= option into an
  # equal-column grid row:
  #   ![[a.svg|column=3]]![[b.svg]]![[c.svg]]  ->  three columns, side by side
  # The option can sit on any embed of the line (first found wins) and the grid
  # wraps, so six embeds with column=3 make two rows of three. A line of
  # adjacent embeds WITHOUT column= is left alone — no silent layout.
  # Emitted as raw HTML because markdown alone can't force equal columns; must
  # run BEFORE convert_images, which would otherwise consume the embeds.
  def self.convert_image_rows(text, baseurl)
    text.gsub(IMAGE_ROW_RE) do |line|
      embeds = line.scan(IMAGE_RE).map { |filename, blob| [filename.strip, parse_image_segments(blob)] }
      cols   = embeds.filter_map { |_, o| o[:column] }.first
      next line unless cols

      imgs = embeds.map do |filename, o|
        %(<img src="#{baseurl}/assets/images/#{filename}" alt="#{CGI.escapeHTML(o[:alt])}">)
      end
      %(<div class="image-row" style="--cols: #{cols}">#{imgs.join}</div>)
    end
  end

  # Split an embed's pipe blob ("caption|width=500", "column=3", ...) into
  # { alt:, width:, column: }. key=value segments are matched against
  # IMAGE_OPTS (numeric values only); the first plain segment is the alt text.
  # A bare numeric segment ("500" or "500x300") is Obsidian's drag-resize
  # width syntax — honored as width= so a resize in Obsidian isn't read as alt.
  def self.parse_image_segments(blob)
    opts = { alt: "" }
    blob.to_s.split("|").map(&:strip).reject(&:empty?).each do |part|
      if (m = part.match(/\A(\d+)(?:x\d+)?\z/))
        opts[:width] ||= m[1]
      elsif (kv = part.match(/\A([a-z]+)\s*=\s*(\d+)\z/i))
        key = IMAGE_OPTS[kv[1].downcase]
        opts[key] = kv[2] if key
      elsif opts[:alt].empty?
        opts[:alt] = part
      end
    end
    opts
  end

  # Convert ![[image.ext]] / ![[image.ext|alt]] -> ![alt](baseurl/assets/images/..)
  #
  # Pipe segments after the filename, in any order:
  #   ![[img.svg|A caption]]             first plain segment -> alt text
  #   ![[img.svg|width=500]]             display width in px on the built site
  #   ![[img.svg|alt text|width=500]]    alt + width together
  #   ![[img.svg|500]]                   what Obsidian writes when an image is
  #                                      drag-resized in the editor; same as width=
  # A sized image is emitted as an <img> tag (markdown can't carry a width);
  # the base img CSS (max-width:100%) still shrinks it on narrow screens.
  def self.convert_images(text, baseurl)
    text.gsub(IMAGE_RE) do
      filename = $1.strip
      o        = parse_image_segments($2)

      if o[:width]
        %(<img src="#{baseurl}/assets/images/#{filename}" alt="#{CGI.escapeHTML(o[:alt])}" width="#{o[:width]}">)
      else
        "![#{o[:alt]}](#{baseurl}/assets/images/#{filename})"
      end
    end
  end

  # Convert ![[name.base]] -> {% include name-table.html %}
  def self.convert_base_embeds(text)
    text.gsub(BASE_RE) { "{% include #{$1.strip}-table.html %}" }
  end

  # Convert ![[model.stl]] / ![[model.stl|Caption]] -> a viewer div.
  #
  # Obsidian shows these as an unresolved embed in preview (it has no STL
  # renderer), but the note stays plain markdown — no raw HTML to author — and
  # the built site renders the model.
  #
  # The <script> that drives the viewer is NOT emitted here: kramdown escapes and
  # smart-quotes a script tag that comes out of markdown. Instead the hook sets
  # page.has_model and _layouts/default.html emits the tag. That also keeps the
  # ~170KB three.js payload off every page that has no model.
  # Pipe segments after the filename, in any order:
  #   ![[m.stl]]                        bare
  #   ![[m.stl|A label]]                first plain segment -> aria-label
  #   ![[m.stl|A label|spin=ccw]]       label + option
  #   ![[m.stl|spin=off]]               option only
  #
  # The plain segment feeds the accessible label only; it is not rendered as
  # visible caption text. The visible affordance is the rotate-3d icon that
  # stl-viewer.js injects (see .stl-viewer-hint).
  def self.convert_models(text)
    text.gsub(MODEL_RE) do
      filename = $1.strip
      caption  = ""
      opts     = {}

      $2.to_s.split("|").map(&:strip).reject(&:empty?).each do |part|
        if (kv = part.match(/\A([a-z][a-z0-9-]*)\s*=\s*(.+)\z/i))
          key = kv[1].downcase
          opts[key] = kv[2].strip if MODEL_OPTS.include?(key)
        elsif caption.empty?
          caption = part
        end
      end

      label = caption.empty? ? "3D model — drag to rotate" : caption
      src   = "{{ \"/assets/models/#{filename}\" | relative_url }}"

      html = +%(<div class="stl-viewer" data-src="#{src}" data-label="#{CGI.escapeHTML(label)}")
      opts.each { |k, v| html << %( data-#{k}="#{CGI.escapeHTML(v)}") }
      html << %(><span class="stl-viewer-fallback">Loading 3D model…</span></div>)
      html
    end
  end

  # Stash code (fenced blocks + inline spans) behind sentinels so the conversions
  # can't rewrite example syntax. Returns [masked_text, store]; pair with
  # restore_code after converting.
  def self.mask_code(text)
    store = []
    stash = ->(m) { store << m; "#{CODE_SENTINEL}#{store.size - 1}#{CODE_SENTINEL}" }
    text = text.gsub(/^[ \t]*```[^\n]*\n.*?^[ \t]*```[ \t]*$/m) { stash.call($&) }
    text = text.gsub(/`[^`\n]*`/) { stash.call($&) }
    [text, store]
  end

  def self.restore_code(text, store)
    text.gsub(/#{CODE_SENTINEL}(\d+)#{CODE_SENTINEL}/) { store[$1.to_i] }
  end
end

Jekyll::Hooks.register [:pages, :documents], :pre_render do |item|
  next unless item.path.end_with?('.md')
  next unless item.content

  baseurl = item.site.config['baseurl'] || ''

  # ---- Frontmatter image (SEO metadata): ![[img.ext]] -> /assets/images/img.ext
  if item.data['image'] && item.data['image'].match(/!\[\[([^\]]+\.(jpg|jpeg|png|gif|svg|webp))\]\]/i)
    item.data['image'] = "/assets/images/#{$1.strip}"
  end

  # If the first content line is just an image, give coffee notes a sane description.
  if item.content.strip.match(/^!\[\[([^\]]+\.(jpg|jpeg|png|gif|svg|webp))\]\]/)
    item.data['description'] ||= "Coffee review with tasting notes and brewing recommendations"
  end

  # Hide code spans/blocks so example syntax inside them is never converted.
  item.content, code = ObsidianLinks.mask_code(item.content)

  # ---- Conversions, in a safe order:
  #   1. .base embeds  2. models  3. images  4. markdown .md links  5. wiki links
  # (Images before wiki links so ![[img]] is never mistaken for a [[link]].)
  item.content = ObsidianLinks.convert_base_embeds(item.content)

  # Flag pages embedding a 3D model so the layout can pull in the viewer script.
  item.data['has_model'] = true if item.content.match?(ObsidianLinks::MODEL_RE)
  item.content = ObsidianLinks.convert_models(item.content)
  item.content = ObsidianLinks.convert_image_rows(item.content, baseurl)
  item.content = ObsidianLinks.convert_images(item.content, baseurl)

  if item.content.include?('{% if') || (item.data['layout'] == 'doc')
    # Files that carry their own Liquid: convert per line, leaving any line that
    # already contains a Liquid tag untouched.
    item.content = item.content.lines.map do |line|
      next line if line.include?('{%') || line.include?('{{')

      line = line.gsub(ObsidianLinks::MD_LINK_RE) do
        disp, path = $1.strip, $2.strip
        path.include?('://') ? "[#{disp}](#{path})" :
          "[#{disp}](#{baseurl}#{ObsidianLinks.target_path(path)})"
      end
      line.gsub(ObsidianLinks::WIKI_RE) do
        target = $1.strip
        disp   = $2 ? $2.strip : target
        "[#{disp}](#{baseurl}#{ObsidianLinks.target_path(target)})"
      end
    end.join
  else
    # Simple markdown files: emit relative_url so baseurl is applied at render.
    item.content = item.content.gsub(ObsidianLinks::MD_LINK_RE) do
      disp, path = $1.strip, $2.strip
      path.include?('://') ? "[#{disp}](#{path})" :
        "[#{disp}]({{ \"#{ObsidianLinks.target_path(path)}\" | relative_url }})"
    end
    item.content = item.content.gsub(ObsidianLinks::WIKI_RE) do
      target = $1.strip
      disp   = $2 ? $2.strip : target
      "[#{disp}]({{ \"#{ObsidianLinks.target_path(target)}\" | relative_url }})"
    end
  end

  # Put the untouched code back.
  item.content = ObsidianLinks.restore_code(item.content, code)
end
