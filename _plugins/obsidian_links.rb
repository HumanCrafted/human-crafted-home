Jekyll::Hooks.register :site, :post_read do |site|
  # Process all pages and documents
  (site.pages + site.documents).each do |item|
    next unless item.path.end_with?('.md')
    
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
  end
end