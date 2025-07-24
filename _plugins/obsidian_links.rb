Jekyll::Hooks.register [:pages, :documents], :pre_render do |item|
  next unless item.path.end_with?('.md')
  
  # Convert Obsidian image syntax in frontmatter 'image' field for SEO metadata
  if item.data['image'] && item.data['image'].match(/!\[\[([^\]]+\.(jpg|jpeg|png|gif|svg|webp))\]\]/i)
    filename = $1.strip
    item.data['image'] = "/assets/images/#{filename}"
  end
  
  # Also set description from content if first line is just an image
  if item.content.strip.match(/^!\[\[([^\]]+\.(jpg|jpeg|png|gif|svg|webp))\]\]/)
    # If first line is just an image, use the image filename as description instead
    filename = $1.strip
    item.data['description'] = "Coffee review with tasting notes and brewing recommendations"
  end
  
  # Skip processing if content contains complex Liquid template blocks (avoid interfering with templates)
  # But allow simple relative_url usage which is created by our own processing
  if item.content.include?('{% if')
    # Only process simple Obsidian links, avoid complex template areas
    # Convert [text](/index.md) and [text](../index.md) to homepage link (safest conversion)
    item.content = item.content.gsub(/\[([^\]]+)\]\((\.\.\/)?index\.md\)/) do |match|
      display_text = $1.strip
      "[#{display_text}]({{ \"/\" | relative_url }})"
    end
    
    # Convert [text](_docs/filename.md) to Jekyll-style links (in text content only)
    item.content = item.content.gsub(/\[([^\]]+)\]\(_docs\/([^)]+)\.md\)/) do |match|
      display_text = $1.strip
      filename = $2.strip
      # Handle URL encoding (e.g., %20 for spaces) and convert to Jekyll-friendly format
      filename = CGI.unescape(filename).downcase.gsub(/\s+/, '-').gsub(/[^a-z0-9\-_]/, '')
      baseurl = item.site.config['baseurl'] || ''
      "[#{display_text}](#{baseurl}/#{filename}/)"
    end
    
    # Convert Obsidian image syntax ![[image.ext]] to Jekyll format (for template files)
    item.content = item.content.gsub(/!\[\[([^\]]+\.(jpg|jpeg|png|gif|svg|webp))\]\]/i) do |match|
      filename = $1.strip
      "![]({{ \"/assets/images/#{filename}\" | relative_url }})"
    end
  else
    # Full processing for simple markdown files without templates
    # Convert [[page-name|Display Text]] to [Display Text]({{ "/page-name/" | relative_url }})
    item.content = item.content.gsub(/\[\[([^\|\]]+)\|([^\]]+)\]\]/) do |match|
      page_name = $1.strip
      display_text = $2.strip
      "[#{display_text}]({{ \"/#{page_name}/\" | relative_url }})"
    end
    
    # Convert [[page-name]] to [page-name]({{ "/page-name/" | relative_url }})
    item.content = item.content.gsub(/\[\[([^\]]+)\]\]/) do |match|
      page_name = $1.strip
      "[#{page_name}]({{ \"/#{page_name}/\" | relative_url }})"
    end
    
    # Convert [text](_docs/filename.md) to Jekyll-style links
    item.content = item.content.gsub(/\[([^\]]+)\]\(_docs\/([^)]+)\.md\)/) do |match|
      display_text = $1.strip
      filename = $2.strip
      # Handle URL encoding (e.g., %20 for spaces) and convert to Jekyll-friendly format
      filename = CGI.unescape(filename).downcase.gsub(/\s+/, '-').gsub(/[^a-z0-9\-_]/, '')
      baseurl = item.site.config['baseurl'] || ''
      "[#{display_text}](#{baseurl}/#{filename}/)"
    end
    
    # Convert [text](/index.md) and [text](../index.md) to homepage link
    item.content = item.content.gsub(/\[([^\]]+)\]\((\.\.\/)?index\.md\)/) do |match|
      display_text = $1.strip
      "[#{display_text}]({{ \"/\" | relative_url }})"
    end
    
    # Convert Obsidian image syntax ![[image.ext]] to Jekyll format
    item.content = item.content.gsub(/!\[\[([^\]]+\.(jpg|jpeg|png|gif|svg|webp))\]\]/i) do |match|
      filename = $1.strip
      "![]({{ \"/assets/images/#{filename}\" | relative_url }})"
    end
    
    # Convert Obsidian image syntax with alt text ![[image.ext|alt text]]
    item.content = item.content.gsub(/!\[\[([^\|\]]+\.(jpg|jpeg|png|gif|svg|webp))\|([^\]]+)\]\]/i) do |match|
      filename = $1.strip
      alt_text = $3.strip
      "![#{alt_text}]({{ \"/assets/images/#{filename}\" | relative_url }})"
    end
  end
end