# Claude Code Development Notes

## Project Overview
Jekyll website for Human Crafted LLC, implementing a Figma design with exact color matching and layout specifications.

## Design System
- **Colors**: Tan background (#dfd7c8), Dark text (#333333), Yellow highlights (#ffff00)
- **Fonts**: IBM Plex Mono (primary), Work Sans (buttons)
- **Layout**: Fixed navigation, 20vh top padding, 40vh hero section

## Recent Changes Made

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
- `_config.yml` - Jekyll configuration
- `assets/css/main.css` - Main stylesheet with design system
- `_layouts/default.html` - Base template with fixed nav and footer
- `index.md` - Homepage with hero section and project grid
- `_projects/` - Individual project markdown files

## CSS Architecture

### Key Classes
- `.hero-title` - Hero section styling (40vh height, centered text)
- `.site-nav .colab-btn` - Co/lab button with high specificity
- `.archive-header` - Project grid section
- `.tag-filter.active::before` - Yellow highlight bars
- `.footer-content` - Social links layout

### Responsive Breakpoints
- Mobile: `@media (max-width: 768px)`
- Adjusts hero height to 30vh and container padding to 15vh

## Figma Design Implementation
- Fixed navigation matching Figma positioning
- Exact color values from design system
- Proper spacing with vh units for responsive scaling
- All typography and sizing specifications matched

## Known Issues
- None currently identified

## Next Steps
- Continue implementing any additional Figma design elements
- Test responsive behavior across devices
- Optimize performance if needed

---
*Last updated: $(date)*
*Claude Code session documentation*