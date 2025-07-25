# Claude Code Development Notes

## Project Overview
Jekyll website for Human Crafted LLC, implementing a Figma design with exact color matching and layout specifications, based on markdown files managed in Obsidian.

## Design System
- **Colors**: Tan background (#dfd7c8), Dark text (#333333), Yellow highlights (#ffff00)
- **Fonts**: IBM Plex Mono (primary), Work Sans (buttons)
- **Layout**: Fixed navigation, 20vh top padding, 40vh hero section

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
# Navigate to project
cd /Users/nginear/Documents/GitHub/human-crafted-home

# Start server with Homebrew Ruby
export PATH="/opt/homebrew/opt/ruby/bin:$PATH" && nohup bundle exec jekyll serve --host 127.0.0.1 --port 4000 > jekyll.log 2>&1 &

# Check if running
ps aux | grep -v grep | grep jekyll

# View logs
tail jekyll.log
```

**Local URL**: http://127.0.0.1:4000/Human-Crafted-Home/

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
- **404 Errors**: Verify baseurl (`/Human-Crafted-Home/`) is included in URLs
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

---
*Last updated: July 22, 2025*
*Claude Code session documentation*