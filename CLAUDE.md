# Claude Code Development Notes

## Project Overview
Jekyll website for Human Crafted LLC, implementing a Figma design with exact color matching and layout specifications, based on markdown files managed in Obsidian.

## Keep the /website/ page current
`_docs/website.md` (the public `/website/` note) is a self-described account of how this site is built — its stack, linking/plugin behavior, design system, and key decisions. It drifts out of date easily. After any change to the build, plugins, linking convention, collections, design system, or workflow, check `_docs/website.md` and update it so the account stays accurate.

## Linking convention (ONE style — use it everywhere)
Authored in Obsidian, built by Jekyll/GitHub Actions. Both understand exactly one internal-link style:

- **Internal links:** `[[slug|Display Text]]` (or `[[slug]]`). `slug` is the target note's filename without `.md` — e.g. `[[shop-v3|the new shop]]`. Works in Obsidian AND resolves on the built site.
- **Images:** `![[file.ext]]` — files live in `assets/images/`. (Alt text: `![[file.ext|alt]]`.)
- **Image options (July 2026):** pipe segments after the filename, same `key=value` pattern as STL embeds — first plain segment = alt text, keys whitelisted in `IMAGE_OPTS` (numeric values only). `![[plan.svg|width=500]]` renders 500px wide on the built site. `![[a.svg|column=3]]![[b.svg]]![[c.svg]]` — a line of nothing but 2+ embeds where any embed carries `column=N` — renders as an equal-column grid row (`.image-row`, `--cols`); more embeds than columns wrap to new grid rows; on mobile (≤768px) rows collapse to a single full-width column. **Explicit only:** a line of adjacent embeds *without* `column=` gets no special layout (a silent same-line rule was tried and rejected as too magic; a bare `|3` column option was rejected because a numeric segment is Obsidian's *image width in px*). A bare numeric segment (`|500` — what Obsidian writes on drag-resize) is honored as `width=` so it's never mistaken for alt text. Handled by `IMAGE_ROW_RE`/`convert_image_rows`/`parse_image_segments` in the plugin (`convert_image_rows` must run before `convert_images`); styled in `main.css` under `.image-row`. First used on `_projects/shop-v3.md`.
- **Note embeds → material chips (Sept 2026):** `![[acrylic-black]]` (no file extension — Obsidian's note transclusion) renders on the site as a labeled chip: the note's `image:` with its `title` as the caption (the `finish` was shown beneath and dropped as redundant). A line of nothing but note embeds becomes a `.chip-row` grid (one column per chip up to `CHIP_MAX_COLS` = 6, or `column=N` on any embed, like image rows); a first plain pipe segment overrides the caption (`![[acrylic-light-green-transparent|Light Green]]`). Any document with an `image:` works — filament or fabric notes later, not just acrylic. If a slug doesn't resolve to a note with an image the **whole line is left as typed** and a build warning names it. Handled by `NOTE_EMBED_RE`/`NOTE_ROW_RE`/`convert_note_embeds`/`find_note` in the plugin, run after `convert_images` (images carry an extension, notes don't) and before wiki links; styled in `main.css` under `.chip-row`/`.material-chip`. First used in the "Materials and colors" section of `_projects/tissue-dispenser.md`. Deliberately **no link** on a chip — customers don't need the vendor page.
- **3D models:** `![[file.stl]]` — files live in `assets/models/`; renders a drag-to-spin viewer. (Caption: `![[file.stl|caption]]`; options: `![[file.stl|caption|spin=cw]]`.) See "STL viewer" below.
- **Do NOT** hand-write `[text](path.md)` markdown links. They only ever converted for `_docs/` targets, silently broke for `_projects/`/root paths, and — worse — typing one to a note that doesn't exist yet makes Obsidian auto-create an empty `.md` file, which used to crash the whole build.

How it resolves (`_plugins/obsidian_links.rb`): the wiki-link target is slugified (lowercased, spaces/underscores → hyphens), so `[[Shop V3]]`, `[[shop_v3]]`, `[[shop-v3]]` all map to `/shop-v3/`. Every project and doc is `/:slug/`. Post links drop their `YYYY-MM-DD-` filename prefix (`[[2016-06-30-made-better]]` → `/made-better/`). Hub pages whose permalink differs from their filename are aliased in `PERMALINK_ALIASES` (currently `core`/`re`/`more` → `/re/`, `index`/`home` → `/`); add to that map if a new custom-permalink page appears. The plugin still converts stray `[text](path.md)` links as a best-effort fallback, but don't rely on it. Links inside `` `inline code` `` or ```` ```fenced blocks``` ```` are left untouched, so a doc can show literal `[[slug]]`/`![[img]]` examples (that's how `/website/` and `voice-guide` document the syntax).

**Gotcha — Liquid on the same line as a wiki-link:** in any file that carries `{% if` (or any `layout: doc` note), the plugin converts links *per line* and leaves every line containing `{%` or `{{` untouched. A `[[slug|Text]]` on such a line therefore reaches kramdown raw, and its `|` turns the whole paragraph into a table. Put the Liquid on its own line with trimming tags (`{%- … -%}`) so the surrounding prose still joins — see the "(or buy some)" fragment in `core.md`.

**Safety net:** `_plugins/co_re_redirects.rb` now skips non-document (StaticFile) entries, so an empty/front-matter-less `.md` can no longer take down the build — worst case is one dead link. If a build ever fails, first check for 0-byte files: `find . -name '*.md' -size 0`.

## STL viewer (July 2026)
`![[model.stl]]` in a note renders a drag-to-spin 3D viewer. First used on `_projects/cord-keeper.md`.
- **Files:** `assets/models/*.stl`; `assets/js/stl-viewer.js`; three.js vendored at `assets/js/lib/three.module.min.js`. (NOT `assets/js/vendor/` — `.gitignore` has a blanket `vendor/` for Ruby and would silently untrack it.)
- **Wiring:** `_plugins/obsidian_links.rb` `MODEL_RE` emits the viewer div and sets `page.has_model`; `_layouts/default.html` uses that flag to include the script. The `<script>` is emitted from the layout, NOT from the plugin — kramdown escapes and smart-quotes a script tag that comes out of markdown.
- **Embed options:** pipe segments after the filename, order-independent. First plain segment = caption; `key=value` segments become `data-<key>` attributes, whitelisted by `MODEL_OPTS` (currently `spin`, `up`). To add an option: append the key to `MODEL_OPTS` and read `el.dataset.<key>` in the viewer — no regex change needed. Exception: `width=700` (July 2026) is handled in `convert_models` itself, not via `MODEL_OPTS` — it emits an inline style sizing the viewer box to 700px wide with height scaled at `MODEL_ASPECT` (330/480), because model on-screen size tracks box *height*, so width alone wouldn't grow the model. Same `width=` key as image embeds.
- **Spin:** `spin=ccw` (default) / `cw` / `off`. The camera orbits rather than the model turning, so the signs invert — `SPIN_DIRS` maps direction to a sign. Verified visually: a front feature drifting left is clockwise-from-above.
- **Up axis:** `up=+z` / `-x` / etc. (bare `z` = `+z`; default `+y`). Declares which of the model's own axes points up, for STLs not authored Y-up — CAD tools like Fusion export Z-up (`up=+z`) and arrive on their side otherwise. `UP_ROTATIONS` maps each value to the mesh rotation that carries that axis onto world +Y, which is also the axis the camera orbits, so the idle spin turns around the chosen up. Rotation is about the origin and the bounding sphere is rotation-invariant, so framing is unaffected. This replaces the old "hand-edit `mesh.rotation.x`" approach — no code change per model.
- **Presentation:** no panel/border — the renderer uses `alpha: true` and the model floats on `--background`. That means the model tone must contrast with the *paper*, not a panel: light uses `--surface`, dark uses `--muted-foreground` with a brighter hemisphere sky (`--foreground`, intensity 1.5) so the side facing away from the key light doesn't sink into the dark paper.
- **Lighting:** key + fill directional lights, a `HemisphereLight`, and a low `AmbientLight`. The hemisphere `groundColor` must NOT be `--background` — that tints every downward-facing face the paper color and reads as a shadow cast on a floor the scene doesn't have (it's `--muted`). The ambient floor keeps the underside from bottoming out at black when the model is spun to show its base.
- **Layout:** the viewer is a left-anchored block (`max-width: 30rem`, `height: 330px`, `justify-content: flex-start`), not a full-width band — keep width ≥ ~26rem or the fit switches to the horizontal axis and the model shrinks. Model on-screen size scales with the box height (vertical-axis fit), so height and `MARGIN` are the two size knobs — `MARGIN` is 1.18. A short object like the puck leaves vertical air even when fitted: that's the rotation envelope (the bounding sphere is much taller than the flat puck), and the model grows into it when spun, so don't crush it out.
- **Affordance:** a Lucide rotate-3d SVG is injected by the JS (not the plugin — keeps the inline SVG away from kramdown) and pinned top-left above the model via `.stl-viewer-hint` (`top:0; left:0`, aligned to the text column). It replaces any "drag to spin" caption text. `aria-hidden` on the icon; the real label lives on `.stl-viewer` (the embed's plain segment, or the default). That plain segment feeds the label only — it does NOT render as visible caption text (the plugin emits no `<p>`).
- **Cost:** three.js is ~170KB gzipped. It loads only on pages with a model, and only once one scrolls into view (`IntersectionObserver`). Verify with `performance.getEntriesByType('resource')` — the local server doesn't gzip, so it reports ~672KB; GitHub Pages serves it compressed.
- **Framing:** the model is normalized to a unit bounding sphere and the camera distance derived from the viewport aspect, so any STL frames identically at any size and can't clip while spinning. Don't hand-tune camera constants per model.
- **Gotcha:** `renderer.setSize(w, h, false)` skips setting canvas CSS size — the canvas then lays out at its device-pixel buffer size and gets cropped (looks "zoomed in ~2×" on a retina screen). Use `setSize(w, h)`.
- **Orientation:** `cord-keeper.stl` is Y-up (it rests on Y=0), matching three.js, so no axis correction. A model authored on a different axis (Fusion exports Z-up) declares it per-embed with the `up=` option (see below) — no code change. Check which axis rests on zero to know what to pass.
- **Scroll:** wheel-zoom requires ctrl/meta (that's what a trackpad pinch sends) so plain page scroll isn't hijacked over the viewer.

## Design System
Source of truth: the `human-crafted-design-system` repo (`tokens.css`, `DESIGN.md`) + the Figma file `HCd – Design System` (key `nHIcjHP7MZOQRSB4lptWu4`). Live reference page: `/design-system/` (the `_docs/design-system.md` Note).
- **Colors (light)**: paper `#FAF7F2`, ink `#2A2824`, ink-muted `#736356`, border `#948F87`, accent `#E8C84A`. **Dark**: paper `#2A2824`, ink `#ECE3CE`, accent `#C9A832`. Tokens live as CSS vars in `main.css` (`--background`/`--foreground`/`--accent`/`--muted`/`--muted-foreground`/`--surface`/`--border`).
- **Fonts**: IBM Plex Mono (body/nav/hero), **IBM Plex Sans Bold** (wordmark + CTA only). Body 16px.
- **Interactions**: wavy-underline on hover for content/nav links (no accent color in links); the header wordmark is the exception (no underline).
- **Layout**: Fixed navigation, 20vh top padding, 40vh hero, `scrollbar-gutter: stable` so short and long pages center identically.

> Older notes below this point may reference the **pre-2026 palette** (tan `#dfd7c8` / `#333333` / pure `#ffff00`, Work Sans). That was migrated to the design-system tokens above in June 2026 — see "Design System Refresh".

## Recent Changes Made

### Update Docs
- Placeholder for update-docs documentation tracking updated
- Ensures consistent documentation management workflow
- Updated tracking of documentation update process

### Navigation Bar
- Fixed position with backdrop blur effect
- Background: `rgba(223, 215, 200, 0.8)` with `backdrop-filter: blur(8px)`
- Vertically centered content
- Yellow highlight bar for "More" link

### Hero Section
- Uses `.hero-title` class instead of generic h1 styling
- 40vh height with vertically centered text
- 20vh top padding on container
- 6rem bottom margin

### Let's co/lab Button
- Dark background with tan text (#dfd7c8)
- Work Sans font, 700 weight, 22px size
- Arrow icon with proper SVG styling
- CSS specificity: `.site-nav .colab-btn` to override nav link styles

### Font Rendering
- Added Tailwind-style font smoothing:
  - `-webkit-font-smoothing: antialiased`
  - `-moz-osx-font-smoothing: grayscale`
  - `text-rendering: optimizeLegibility`

### Footer
- Social media icons (Instagram, Twitter, LinkedIn, GitHub)
- Horizontal layout with copyright left, social links right
- Responsive mobile layout

### Pages Collection & Tool Pages (Dec 2025)
- Added `_pages` collection to `_config.yml` with `permalink: /:name/`
- Created laser-cutter.md and fusion360.md tool pages in `_pages/`
- Fixed Liquid syntax errors (removed `or` operators from `where_exp` filters)
- Added automatic back links to `_pages` collection via default.html layout
- Tool pages follow same pattern as project pages with consistent styling

### Typography & Spacing Improvements
- Fixed H3 heading spacing: added `margin-top: 2.5rem` for proper section separation
- Removed duplicate H1 titles from page content (layout handles titles automatically)
- Added 3rem margin-bottom to `.project-meta` for better back link spacing
- Improved markdown content rendering with proper whitespace respect

### Link Styling & Hover Effects
- Added wavy underline hover effects for all content links using `text-decoration-style: wavy`
- Project grid titles: no underline by default, wavy underline on hover
- Body content links: underlined with wavy effect on hover
- Font weight changes to medium (500) on all link hover states
- Category links and tool page links follow consistent hover patterns
- Lightbox close button: proper centering and Human Crafted tan color for X

### Obsidian Integration
- Created `_plugins/obsidian_links.rb` for seamless Obsidian-Jekyll workflow
- Plugin converts `[[page-name|Display Text]]` → `[Display Text]({{ "/page-name/" | relative_url }})`
- Also handles `[[page-name]]` → `[page-name]({{ "/page-name/" | relative_url }})`
- Supports drag-and-drop linking from Obsidian with automatic URL conversion
- Works for all markdown files in collections and pages
- Enables natural Obsidian workflow while maintaining Jekyll functionality

## Jekyll Development Server

### How to Start Local Server
```bash
# Working dir is the iCloud Obsidian vault (NOT Documents/GitHub):
cd "/Users/nginear/Library/Mobile Documents/iCloud~md~obsidian/Documents/human-crafted-home"

# Start server with Homebrew Ruby. Ruby 3.4.7 + a stale Gemfile.lock pin means
# the 2.6.9 bundler binstub fails — call bundler 2.7.2 explicitly. Run
# `bundle _2.7.2_ install` first if gems are missing or a gem was just added.
export PATH="/opt/homebrew/opt/ruby/bin:$PATH" && nohup bundle _2.7.2_ exec jekyll serve --host 127.0.0.1 --port 4000 > jekyll.log 2>&1 &

# Check if running
ps aux | grep -v grep | grep jekyll

# View logs
tail jekyll.log
```

**Local URL**: http://127.0.0.1:4000/

### Stop Server
```bash
pkill -f "jekyll serve"
```

## Dependencies
- Ruby 3.4.4 (via Homebrew)
- Bundler 2.6.9
- Jekyll with GitHub Pages compatible plugins

## File Structure
- `_config.yml` - Jekyll configuration with collections: pages, posts, projects
- `assets/css/main.css` - Main stylesheet with design system
- `_layouts/default.html` - Base template with fixed nav, footer, and automatic page titles
- `_layouts/project.html` - Project-specific layout with image galleries and lightbox
- `index.md` - Homepage with hero section and project grid
- `_projects/` - Individual project markdown files with Obsidian-style image references
- `_pages/` - Tool pages and other standalone pages (laser-cutter.md, fusion360.md)
- `_plugins/obsidian_links.rb` - Converts Obsidian links to Jekyll URLs

## CSS Architecture

### Key Classes
- `.hero-title` - Hero section styling (40vh height, centered text)
- `.site-nav .colab-btn` - Co/lab button with high specificity
- `.projects-header` - Project grid section
- `.tag-filter.active::before` - Yellow highlight bars
- `.footer-content` - Social links layout

### Responsive Breakpoints
- Mobile: `@media (max-width: 768px)`
- Adjusts hero height to 30vh and container padding to 20vh
- Mobile navigation: vertical stack with custom order (Let's co/lab, More, theme toggle)
- Mobile navigation gap: 0.25rem for compact spacing
- Logo aligned to flex-start on mobile header
- H1 font size reduced to 2.25rem on mobile
- Project meta layout: vertical stack with 1rem gap (overrides 4rem desktop gap)

## Figma Design Implementation
- Fixed navigation matching Figma positioning
- Exact color values from design system
- Proper spacing with vh units for responsive scaling
- All typography and sizing specifications matched

## Yellow Highlight Hover Effect

### Git Version Control
Current yellow highlight system is saved in Git commit: `24fbbea`

**To revert to yellow highlights:**
```bash
# Revert just CSS file
git checkout 24fbbea -- assets/css/main.css

# Revert everything to this commit
git reset --hard 24fbbea

# View the saved commit
git show 24fbbea
```

**To experiment safely:**
```bash
# Option 1: Work directly (can always revert)
# Make changes directly to main.css

# Option 2: Create experimental branch
git checkout -b hover-experiment
# Make changes, switch back with: git checkout main
```

### Yellow Highlight Features Saved
- Sliding yellow bar animations for nav links
- Category filter hover effects  
- 350ms smooth transitions
- Dark mode with 0.3 opacity yellow
- GPU acceleration with `transform: translateZ(0)`
- `will-change: auto` for performance
- Proper `translateX(-110%)` hidden state

### Implementation Details
- Uses CSS `::before` pseudo-elements
- `transform: translateY(-50%) translateX()` for positioning
- `transition: transform 350ms ease` for timing
- `z-index: -1` to keep behind text
- Supports both light/dark themes

**Commit hash**: `24fbbea` - "Complete yellow highlight hover system with full functionality"

## Troubleshooting

### Jekyll Server Issues
- **Liquid Syntax Errors**: Check for `or` operators in `where_exp` filters - not supported
- **Plugin Not Loading**: Restart Jekyll server after adding/modifying plugins
- **404 Errors**: Verify baseurl is correctly set in _config.yml
- **Cache Issues**: Clear `_site` and `.jekyll-cache` directories if needed

### Obsidian Workflow
- Use drag-and-drop or `[[]]` links naturally in Obsidian
- Plugin automatically converts to Jekyll-compatible URLs
- For complex tables, use Jekyll `{{ "/page/" | relative_url }}` syntax directly
- All links work in both Obsidian preview and live Jekyll site

### Collection Management
- **Projects**: Use `_projects/` for portfolio items with galleries
- **Pages**: Use `_pages/` for tool pages, about pages, etc.
- **Posts**: Use `_posts/` for blog content (if needed)
- All collections have automatic permalinks and layouts

## Best Practices

### Content Creation
1. Write in Obsidian using natural linking
2. Use `![[image.ext]]` format for images (automatically converted)
3. Let Jekyll handle titles via front matter (don't duplicate in content)
4. Use H3 headings for sections (proper spacing applied)

### Image Management
- Store images in `assets/images/`
- Use Obsidian format `![[filename.ext]]` for automatic conversion
- Jekyll converts to proper relative URLs with baseurl

### CSS Changes
- Test changes locally before committing
- Use proper specificity for overrides (use `!important` for mobile overrides if needed)
- Consider mobile breakpoints for responsive design
- Yellow highlight system saved in commit `24fbbea` if needed
- Mobile layouts require separate styling from desktop (different flex directions, gaps, alignments)

## Known Issues
- Complex markdown tables may not process Obsidian links correctly (use Jekyll syntax)
- Jekyll server occasionally needs restart for plugin changes

## Wiki Section System (June 12, 2025)

### Implementation
- Created `_includes/wiki-section.html` for collapsible content sections
- Added CSS styling for `.wiki-item`, `.wiki-header`, `.wiki-content`
- Transformed MORE page into wiki-style knowledge hub with auto-populated and manual sections

### Wiki Section Usage Guide

**Basic Syntax:**
```markdown
{% raw %}{% include wiki-section.html title="Section Name" [options] %}{% endraw %}
```

**Required Parameters:**
- `title="Section Name"` - The collapsible header text

**Content Options (pick one or both):**
- `items="item1,item2,item3"` - Manual list of items
- `auto="collection_name"` - Auto-populate from collections

**Item Formatting:**
- Plain text: `items="CNC Router,3D Printer"`
- With links: `items="About me:/about-me/,Process:/process/"`
- Mixed: `items="CNC Router,Fusion 360:/fusion360/,3D Printer"`

**Auto-Population Types:**
- `auto="projects"` - All projects from `_projects`
- `auto="tool_docs"` - Docs tagged with 'tool'
- `auto="process_docs"` - Docs tagged with 'process'  
- `auto="all_docs"` - All docs from `_docs`

**Optional Modifiers:**
- `limit="10"` - Limit auto-populated items (default: unlimited)
- `open="true"` - Start section expanded (default: collapsed)
- `show_all_link="/page/"` - Add "View all" link at bottom
- `show_all_text="Custom text"` - Custom text for view all link

**Example Patterns:**
```markdown
{% raw %}{% include wiki-section.html title="Skills" items="Design,Engineering,Prototyping" %}

{% include wiki-section.html title="Projects" auto="projects" limit="8" %}

{% include wiki-section.html title="Tools" items="CNC Router" auto="tool_docs" %}

{% include wiki-section.html title="Projects" auto="projects" limit="10" show_all_link="/#projects" show_all_text="See all projects" %}

{% include wiki-section.html title="About" items="Bio:/about/" open="true" %}{% endraw %}
```

### CSS Features
- Collapsible sections using HTML `<details>`/`<summary>` elements
- Arrow indicators (▶ rotates to ▼ when open)
- Hover effects matching site design system
- Mobile responsive with adjusted padding and font sizes
- Smooth transitions for expand/collapse animations

## Next Steps
- Continue implementing any additional Figma design elements
- Test responsive behavior across devices
- Expand tool pages and documentation
- Add more auto-population types to wiki-section.html as needed

### Recent Mobile Layout Updates (June 10, 2025)
- **Mobile Navigation Order**: Custom CSS order properties for mobile stack: Let's co/lab (1st), More (2nd), theme toggle (3rd)
- **Navigation Spacing**: Reduced mobile nav gap to 0.25rem for compact layout
- **Header Alignment**: Logo aligned to flex-start (top) on mobile header
- **Typography**: H1 font size reduced to 2.25rem on mobile for better readability
- **Page Meta Layout**: Comprehensive mobile restructure for `_pages` collection:
  - Back link and categories stack vertically with 1rem gap (4rem on desktop with `!important` override)
  - Category section: horizontal layout with "Category:" label and tags
  - Category tags: wrapped in `.category-tags` div, stack vertically on mobile
  - All elements left-aligned with proper flex alignment
- **Button Hover**: Added missing hover effects for mobile co/lab button (wavy underline)

### Mobile Navigation Simplification (July 22, 2025)
- **Simplified Layout**: Removed complex vertical stacking with CSS order properties
- **Hidden Co/lab Button**: "Let's co/lab" button completely hidden on mobile (`display: none`)
- **Horizontal Navigation**: "More" and theme toggle now display side-by-side on single line
- **Clean CSS**: Removed 45 lines of complex mobile-specific CSS overrides and !important declarations
- **Improved UX**: Cleaner, more intuitive mobile navigation with fewer elements

### Project Cleanup (July 22, 2025)
- **Removed Unused Directories**: Deleted `.vercel/` and `.next/` directories (not needed for Jekyll)
- **Security**: Removed `.env.local` file containing GitHub access token
- **File Organization**: Cleaned up project structure while preserving necessary Obsidian and Jekyll files

### Analytics Implementation (September 23, 2025)
- **Added Umami Analytics**: Integrated privacy-first, cookieless analytics using Umami Cloud
- **No Google Analytics**: Verified no existing Google Analytics code was present (clean implementation)
- **Production-Only Tracking**: Analytics only loads in production environment via `jekyll.environment` check
- **Implementation Details**:
  - Script URL: `https://cloud.umami.is/script.js`
  - Website ID: `e3e47e77-adfa-4b94-9cd4-3161e8b948f8`
  - Location: `_layouts/default.html` in `<head>` section
  - Loading: Uses `defer` attribute for optimal page load performance

### Umami Event Tracking (September 23, 2025)
- **Event Tracking Added**: Implemented custom event tracking for key user interactions
- **Navigation Events**:
  - Logo click tracking (`data-umami-event="Logo click"`)
  - More navigation link (`data-umami-event="More nav"`)
  - Let's co/lab CTA button on homepage (`data-umami-event="Colab CTA button"`)
  - Let's co/lab navigation link on other pages (`data-umami-event="Colab nav"`)
  - Theme toggle button (`data-umami-event="Theme toggle"`)
  - Back navigation link (`data-umami-event="Back navigation"`)
- **Social Media Tracking**:
  - All footer social links tracked with platform name (`data-umami-event="Social click"` with `data-umami-event-platform` property)
- **Content Interaction**:
  - Wiki section expansions tracked via JavaScript (`Wiki section expanded` event with section name)
  - Only tracks when sections are opened, not closed
- **Implementation Methods**:
  - Data attributes for simple click tracking (navigation, buttons, links)
  - JavaScript event listeners for dynamic interactions (wiki sections)
  - All tracking only active in production environment

## Design System Refresh & Breadcrumb Wordmark (June 2026)

Shipped — merged to `main` June 2026. (The `design-system-refresh` branch is fully
merged but still exists locally; safe to delete.)

### Design-system migration
- Migrated off the old ad-hoc palette/fonts onto the documented tokens (see Design System above): paper/ink/accent, **IBM Plex Sans** for wordmark + CTA, body 16px, retuned dark-mode SVG invert filter.
- **Project grid → 5 columns** (3 on tablet ≤1024px, 2 on mobile ≤768px).
- **Footer social → a collapsible "socials" disclosure** of lowercase text links (`<details>` in `footer-social.liquid`, data-driven from `_data/social.yml`), with a graceful fade-in. **Superseded** — `fdd05b0` deleted `footer-social.liquid` and moved the links to a standalone page instead. That page is now `_docs/follow.md` (`/follow/`), reached from a plain "follow along!" link in the footer; `_data/social.yml` still drives the list.
- **New living style guide**: `_docs/design-system.md` (a Note, `/design-system/`) — color swatches with **click-to-copy hex**, type/spacing/component specimens. Reuses the `.wiki-two-column` rhythm.
- **Doc/Note section headings** now ruled + Plex Sans Bold (`.doc-content > h2/h3`).

### Breadcrumb wordmark (`_includes/wordmark.html` + `assets/js/wordmark.js`)
- Header wordmark is a breadcrumb reinforcing the `.co` play and doubling as back-nav:
  - Home → `human / crafted` (unchanged, links home).
  - Hubs `/lab/`, `/re/` → `humancrafted.co/lab` · `co/re` — `humancrafted.` dims to 25% (links home), `co/<section>` is bright/current.
  - Sub-pages → nested display-only crumb `humancrafted.co/re/<slug>` (`humancrafted`→home, `co/re`→hub, slug current). **Real URLs stay flat** — the nesting is visual only, no SEO/URL migration.
  - **Made crumb** (Sept 2026): a project that's for sale (shop on, `shop_status: available`) reads `humancrafted.co/made/<slug>` instead — `data-wm-state="made"`; the whole `humancrafted.co/` is the dim home link (one piece, so ≤1024px drops it and shows `made/<slug>`), `made` links to the Made-filtered projects (`/?category=made#projects`, what `/made/` redirects to), slug current. Same `.wm-new` wipe.
  - **Crumb text** (July 2026): explicit front-matter `crumb:` wins, then `title:`, then the de-hyphenated slug. Any post/doc/page with a long descriptive title (e.g. shop-notes posts) should set a short `crumb:` — first used on `_posts/2026-07-31-shop-notes-…​.md` (`crumb: shop notes`).
- **Renamed the hub `/more/` → `/re/`** (co/re = "core", the body of work) via **`jekyll-redirect-from`** (added to `Gemfile` + `_config.yml`); old `/more/` redirects. Nav label stays "More".
- "Let's co/lab" pill shows on **all** pages now.
- On-load motion (Web Animations API; skipped for `prefers-reduced-motion` or hidden/backgrounded tabs): breadcrumb pages **wipe in only the newest path segment**; home **reassembles** (`humancrafted` splits, the `/` drops into the gap) only when arriving from an internal page (`document.referrer` same-origin).

### Quick-access menu (Sept 2026)
Dwelling on the co/re hamburger in the nav (shown on home and on `/re/` itself, where it carries `aria-current="page"`) floats a "Quick links" panel of shortcuts into co/re — an easter egg, not primary nav. Data-driven from `_data/quick_menu.yml` (name + site path or `https://` link, `enabled` switch, file order = display order); external links open in a new tab. Markup in `_layouts/default.html` (`.core-menu` wraps the existing `.core-link`, which still links to `/re/`; panel is `.core-menu-panel` with a `.core-menu-title` + `ul`); styles in `main.css`. Pure CSS: `:hover` opens it only after `--quick-menu-dwell` (1000ms, set on `.core-menu` — the one knob for "how long before it appears"); `:focus-within` opens immediately for keyboard users; `--quick-menu-gap` (1.5rem) is the vertical clearance and also sizes the `::before` hover bridge; close is delayed ~120ms. Panel is borderless with a soft shadow, on `--background` in light (`--surface` was rejected as too dark on light paper) and `--surface` in dark; anchored `left: 0` to the icon. Desktop only: removed under `@media (hover: none), (max-width: 768px)` so a tap navigates to co/re. Umami: `Quick menu` event with an `item` property.

### Shop checkout: Stripe via hcd-checkout (Sept 2026)
**Live since 2026-09-22** (`shop_enabled: true`; one product listed, the
Tissue Dispenser). Checkout is real code, not a faked receipt. Shape, per the July 2026 research in the `made-shop`
repo (`docs/ecommerce-research.md`, "Architecture A"):

- **Flow:** `assets/js/cart.js` holds the cart in localStorage. "Check out" on
  `/cart/` POSTs `{ items: [{sku, qty}], region }` to `site.shop_checkout_endpoint`
  → a Vercel function (**repo `HumanCrafted/hcd-checkout`**, local clone
  `~/Documents/GitHub/hcd-checkout`, Vercel project `hcd-checkout`) that reads
  the site's own `/catalog.json`, re-prices and stock-checks every SKU, creates
  a Stripe Checkout Session, and answers `{ url }`. The browser goes to
  Stripe's hosted page (address, shipping, payment incl. Link/Apple Pay, tax),
  which returns to `/thanks/?session_id=…` (cart.js empties the cart) or
  `/cart/` on cancel. The site never sees a card; the browser never sets a price.
- **Gone:** `checkout.md` and the fake `placeOrder()`/receipt. `thanks.md` is
  static copy (PLACEHOLDER wording). Tax estimate removed from `_data/shop.yml`
  and `catalog.json` — Stripe calculates it (`STRIPE_TAX=1` on the function
  once Stripe Tax is on in the Dashboard); the cart says "at checkout".
- **Region picker on `/cart/`** (`.cart-region`, remembered in `hc-region`; **hidden when `_data/shop.yml` lists a single region** — the cart then states that rate and sends its code; launch is US-only at a flat $8 from Rollo's Ground Advantage 2 lb rates, CA/INTL kept commented in the file):
  hosted Checkout shows *every* `shipping_options` entry to everyone, so the
  shopper picks a region first and the function sends exactly one rate plus
  that region's `countries:` as `allowed_countries`. Each region in
  `_data/shop.yml` needs a `countries:` list (ISO codes; **quote `"NO"`** —
  YAML reads bare `NO` as false) or the function refuses it. The INTL list is
  a placeholder. `catalog.json` now also carries `site` (absolute origin, for
  Stripe product images) and `countries` per region.
- **Errors** come back as `400 { error, notices[] }` and render inline at the
  top of `/cart/` via `showCheckoutNotices()`, same voice as `reconcile()`.
- **Buy block design (Sept 2026):** no card — the block sits on the paper
  between the meta line and the body, whitespace only (the 1px bordered
  `--surface` box is gone). Variants are **pills**, the same control as the
  homepage Made filter: outlined at rest (`box-shadow` inset ring, not a
  border), solid ink when checked, 1px lift on hover, keyboard focus ring via
  `:has(input:focus-visible)`; the real radio is drawn off-screen inside the
  `<label>`. Sold out = muted ring, name struck, the "sold out" flag kept for
  screen readers only. Archived = muted price, muted static pills, dead
  button. Jon dislikes thin square outlines and full-pill *inputs*, so keep
  the stepper and buttons pill-shaped and don't reintroduce bordered boxes.
- **Cart page + drawer (Sept 2026):** same treatment — no hairlines. The
  drawer panel is borderless with a soft shadow (like the quick-links panel),
  its head/foot and the cart lines are separated by spacing only, thumbnails
  float on the paper with no tile (a `--surface` tile was tried and rejected;
  5rem in the drawer, 6.5rem on `/cart/`), the `/cart/` summary has no box,
  the region `<select>` is a rounded `--surface` field with its own inset
  chevron (`appearance: none` + SVG in `--cart-chevron`, swapped for dark;
  the native arrow hugs the edge), ring only on `:focus-visible`, and notices are a rounded `--surface` panel. The qty
  stepper keeps its outlined-pill look on purpose.
- **Multi-option products (Sept 2026):** a product with two axes (size × color…) declares `options:` — a list of `{ name, values }`, list order = display order; a value is a string or `{ label, material }` (material = a `_materials` note slug, for the swatch dot). Its `variants:` are then **combinations**: each names a value from every axis by the axis key (`size: Small, color: Green`) plus its own `sku`/`price`/`stock`; no `name:` — it's derived by `_includes/variant-name.html` as the values joined with " · " ("Large · Green"), used by the buy block, `catalog.json`, and therefore the cart, drawer and Stripe line. A pairing that isn't listed isn't offered. `_includes/buy-options.html` renders one pill row per axis (radio groups `opt-0`, `opt-1`…) plus ONE hidden `variant` radio; the form carries every combination as JSON in `data-combos`, and `resolveCombo()` in cart.js fills the hidden radio from the chosen values, so price/stock/submit read a multi-option product exactly like a single-axis one. Values unreachable from the current choices are greyed (`.is-soldout`) but stay selectable; picking one shows "Sold out in …" / "Not offered in …" and disables Add to cart. On load the picker starts on the first in-stock combination. Per-pill prices are only shown on single-axis products; multi-option shows the resolved price in the header. Archived multi-option products render each axis as static pills. Single-axis products (no `options:`) are untouched. First used (PLACEHOLDER data) on `_projects/acrylic-trees.md`.
- **Variant colors (Sept 2026):** a variant may carry `color: <material-note-slug>` (e.g. `acrylic-black`). `_includes/variant-swatch.html` looks the note up in `site.materials` by `slug` and, if it has `hex:`, draws a 12px dot in the pill (`.variant-swatch`) ringed in `currentColor`, so black survives on the ink pill and white on the paper one. No `color:`/no `hex:` → no dot, nothing else changes. `hex:` on the 42 acrylic notes (`_materials/`) was **sampled from each note's render** (median of a patch at 50%/36% of the image — the floating chip) by a one-off script; re-sample if a render changes. The *information* about colors lives in the page body's "Materials and colors" section (note-embed chips), not in the pill.
- **Materials collection (Sept 2026):** the 42 acrylic notes moved from `_docs/` to **`_materials/`**, a collection with `output: false` (same shape as music and places) — no per-colour pages; the hub `_docs/materials.md` (`/materials/`, title "Materials") renders the table from `site.materials` (tag `acrylic`, grouped by vendor, an "Acrylic" section so filament/fabric/wood can follow as tags + sections) and carries `redirect_from` for `/acrylic-colors/` **and every old `/acrylic-<name>/` URL** → add a line there when a note is renamed. Each note body is now just the swatch image + vendor link (the duplicate specs table was stripped; the fields live in front matter). `_materials/materials.base` is the Obsidian view (`file.inFolder("_materials")`). Note embeds (`![[acrylic-black]]`) still resolve — the plugin's `find_note` searches `site.documents`, which includes non-output collections.
- **Homepage marks — the Made wordmark (Sept 2026):** an available project's card carries a small ink pill bearing the **Made sub-brand wordmark** (inline SVG, `currentColor`, from `_includes/made-wordmark.html`; source `assets/images/made-wordmark.svg`) pinned bottom-right *over the thumbnail box* (`_includes/for-sale-icon.html`, `.for-sale-mark` + `.made-mark` in shop.css). Made is the brand the products ship under, so the card mark is the same mark as on the box. History: "$" disc inline with the title → "shop" (rejected: means the workshop here) → "for sale" text → the wordmark (Jon, 2026-09-22). Cards also carry `data-shop="available"`. The filter bar gets a **Made filter** right after "all" — the same pill, outlined at rest / ink when active — with `data-filter="made"` and an aria-label, only while the shop is on and ≥1 project is available; the inline script's `made` branch is Liquid-guarded so an off build carries no trace. `?category=made` works like any category link; unknown filters fall back to "all". Available project pages lead their "Categories:" line with a plain-text **"made"** link (`.meta-link--for-sale`, aria-label "Made — available to buy") into that filter — text, not the mark, because an image among underlined mono words reads as a sticker. Pill height is 1.625rem so the mark's strokes stay ≥ ~2px. **`/made/`** (`made.md`, `redirect_to` via jekyll-redirect-from, `shop_page: true` so it's withheld while the shop is off) forwards to the filtered view — the short address for bios and packaging. A `made.humancrafted.co` subdomain would be a redirect rule on the hcd-checkout Vercel project, when the shop is live.
- **Local dev:** `jekyll-shop` preview on :4001 (`_config.shop.yml` overrides
  the endpoint to `http://127.0.0.1:3000/api/checkout`) plus, in the
  hcd-checkout repo, `cp .env.example .env.local` (Stripe **test** key,
  `CATALOG_URL=http://127.0.0.1:4001/catalog.json`, `SITE_URL=http://127.0.0.1:4001`)
  and `npm run dev` (a Node shim, no Vercel CLI needed). `npm test` covers
  `buildOrder()` without Stripe or the network.
- **CORS:** the function allows humancrafted.co, www, and the two local
  origins (`localhost:4001`, `127.0.0.1:4001`) — note the preview tab uses
  `localhost`, so a cart added on `127.0.0.1` is a different origin's storage.
- **Stock is still manual:** edit the note's `stock:` after a sale; the rebuilt
  catalog makes the function refuse it. Oversell window = time to edit.
- **Went live 2026-09-22:** live restricted Stripe key + `STRIPE_TAX=1`
  (Stripe Tax Basic, Wisconsin registration) on Vercel; US-only $8 shipping;
  receipts on in Stripe; `_docs/website.md` has its shop paragraph. To take
  the shop down again: `shop_enabled: false` and push — nothing else.

### Dev environment note
Ruby was upgraded to 3.4.7; use `bundle _2.7.2_ exec …` (see Jekyll Development Server). `Gemfile.lock`, `.DS_Store`, `jekyll.log`, `.obsidian/workspace.json`, and `.claude/` are gitignored. The Obsidian git-sync plugin can switch the working-tree branch mid-session.

---
*Last updated: June 10, 2026*
*Claude Code session documentation*