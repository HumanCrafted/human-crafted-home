# Claude Code Development Notes

## Project Overview
Jekyll website for Human Crafted LLC, implementing a Figma design with exact color matching and layout specifications, based on markdown files managed in Obsidian.

## Keep the /website/ page current
`_docs/website.md` (the public `/website/` note) is a self-described account of how this site is built — its stack, linking/plugin behavior, design system, and key decisions. It drifts out of date easily. After any change to the build, plugins, linking convention, collections, design system, or workflow, check `_docs/website.md` and update it so the account stays accurate.

## Linking convention (ONE style — use it everywhere)
Authored in Obsidian, built by Jekyll/GitHub Actions. Both understand exactly one internal-link style:

- **Internal links:** `[[slug|Display Text]]` (or `[[slug]]`). `slug` is the target note's filename without `.md` — e.g. `[[shop-v3|the new shop]]`. Works in Obsidian AND resolves on the built site.
- **Images:** `![[file.ext]]` — files live in `assets/images/`. (Alt text: `![[file.ext|alt]]`.)
- **3D models:** `![[file.stl]]` — files live in `assets/models/`; renders a drag-to-spin viewer. (Caption: `![[file.stl|caption]]`; options: `![[file.stl|caption|spin=cw]]`.) See "STL viewer" below.
- **Do NOT** hand-write `[text](path.md)` markdown links. They only ever converted for `_docs/` targets, silently broke for `_projects/`/root paths, and — worse — typing one to a note that doesn't exist yet makes Obsidian auto-create an empty `.md` file, which used to crash the whole build.

How it resolves (`_plugins/obsidian_links.rb`): the wiki-link target is slugified (lowercased, spaces/underscores → hyphens), so `[[Shop V3]]`, `[[shop_v3]]`, `[[shop-v3]]` all map to `/shop-v3/`. Every project and doc is `/:slug/`. Post links drop their `YYYY-MM-DD-` filename prefix (`[[2016-06-30-made-better]]` → `/made-better/`). Hub pages whose permalink differs from their filename are aliased in `PERMALINK_ALIASES` (currently `core`/`re`/`more` → `/re/`, `index`/`home` → `/`); add to that map if a new custom-permalink page appears. The plugin still converts stray `[text](path.md)` links as a best-effort fallback, but don't rely on it. Links inside `` `inline code` `` or ```` ```fenced blocks``` ```` are left untouched, so a doc can show literal `[[slug]]`/`![[img]]` examples (that's how `/website/` and `voice-guide` document the syntax).

**Safety net:** `_plugins/co_re_redirects.rb` now skips non-document (StaticFile) entries, so an empty/front-matter-less `.md` can no longer take down the build — worst case is one dead link. If a build ever fails, first check for 0-byte files: `find . -name '*.md' -size 0`.

## STL viewer (July 2026)
`![[model.stl]]` in a note renders a drag-to-spin 3D viewer. First used on `_projects/cord-keeper.md`.
- **Files:** `assets/models/*.stl`; `assets/js/stl-viewer.js`; three.js vendored at `assets/js/lib/three.module.min.js`. (NOT `assets/js/vendor/` — `.gitignore` has a blanket `vendor/` for Ruby and would silently untrack it.)
- **Wiring:** `_plugins/obsidian_links.rb` `MODEL_RE` emits the viewer div and sets `page.has_model`; `_layouts/default.html` uses that flag to include the script. The `<script>` is emitted from the layout, NOT from the plugin — kramdown escapes and smart-quotes a script tag that comes out of markdown.
- **Embed options:** pipe segments after the filename, order-independent. First plain segment = caption; `key=value` segments become `data-<key>` attributes, whitelisted by `MODEL_OPTS` (currently just `spin`). To add an option: append the key to `MODEL_OPTS` and read `el.dataset.<key>` in the viewer — no regex change needed.
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
- `.archive-header` - Project grid section
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
- With links: `items="About me:/about-me/,Expertise:/expertise/"`
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

{% include wiki-section.html title="Projects" auto="projects" limit="10" show_all_link="/#archive" show_all_text="See all projects" %}

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
- **Renamed the hub `/more/` → `/re/`** (co/re = "core", the body of work) via **`jekyll-redirect-from`** (added to `Gemfile` + `_config.yml`); old `/more/` redirects. Nav label stays "More".
- "Let's co/lab" pill shows on **all** pages now.
- On-load motion (Web Animations API; skipped for `prefers-reduced-motion` or hidden/backgrounded tabs): breadcrumb pages **wipe in only the newest path segment**; home **reassembles** (`humancrafted` splits, the `/` drops into the gap) only when arriving from an internal page (`document.referrer` same-origin).

### Dev environment note
Ruby was upgraded to 3.4.7; use `bundle _2.7.2_ exec …` (see Jekyll Development Server). `Gemfile.lock`, `.DS_Store`, `jekyll.log`, `.obsidian/workspace.json`, and `.claude/` are gitignored. The Obsidian git-sync plugin can switch the working-tree branch mid-session.

---
*Last updated: June 10, 2026*
*Claude Code session documentation*