Jekyll::Hooks.register [:pages, :documents], :pre_render do |item|
  next unless item.path.end_with?('.md')
  
  # Skip processing if content contains Liquid template blocks (avoid interfering with templates)
  if item.content.include?('{% if') || item.content.include?('{{ ')
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
  end
end