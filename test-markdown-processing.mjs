import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDirectory = path.join(__dirname, 'projects');

function extractImagePaths(markdownContent) {
  console.log(`Extracting image paths from: "${markdownContent}"`);
  // Regular expression to match the markdown image syntax
  const regex = /!\[\]$$(.+?)$$/g;

  // Extract all matches and their captured groups
  const matches = [];
  let match;
  while ((match = regex.exec(markdownContent)) !== null) {
    console.log(`Found match: ${match[0]}, Extracted path: ${match[1]}`);
    matches.push(match[1]); // Capturing group 1 contains the raw path
  }

  console.log(`Extracted ${matches.length} image paths`);
  return matches;
}

function removeImageSyntax(str) {
  if (typeof str !== 'string') {
    console.log(`Input is not a string: ${typeof str}`);
    return str;
  }
  
  console.log(`\nProcessing string: "${str}"`);
  console.log(`String length: ${str.length}`);
  console.log(`Character codes: ${Array.from(str).map(c => c.charCodeAt(0).toString(16)).join(', ')}`);
  
  const paths = extractImagePaths(str);
  if (paths.length > 0) {
    console.log(`Extracted image path: "${paths[0]}"`);
    return paths[0];
  } else {
    console.log("No image syntax found");
    return str;
  }
}

function processYamlMetadata(metadata) {
  console.log(`Processing YAML metadata: ${JSON.stringify(metadata)}`);
  if (typeof metadata === 'string') {
    return removeImageSyntax(metadata);
  }
  if (Array.isArray(metadata)) {
    return metadata.map(processYamlMetadata);
  }
  if (typeof metadata === 'object' && metadata !== null) {
    const result = {};
    for (const [key, value] of Object.entries(metadata)) {
      result[key] = processYamlMetadata(value);
    }
    return result;
  }
  return metadata;
}

async function testMarkdownProcessing() {
  try {
    console.log(`Projects directory: ${projectsDirectory}`);
    const files = await fs.readdir(projectsDirectory);
    console.log(`Found ${files.length} files in directory`);
    
    for (const file of files) {
      if (path.extname(file) === '.md') {
        console.log(`\n\nProcessing file: ${file}`);
        const fullPath = path.join(projectsDirectory, file);
        const fileContent = await fs.readFile(fullPath, 'utf8');
        console.log(`File content length: ${fileContent.length}`);
        const { data: frontmatter, content } = matter(fileContent);
        
        console.log('\nOriginal frontmatter:');
        console.log(yaml.dump(frontmatter));
        
        console.log('\nProcessing frontmatter...');
        const processedFrontmatter = processYamlMetadata(frontmatter);
        
        console.log('\nProcessed frontmatter:');
        console.log(yaml.dump(processedFrontmatter));

        // Log specific fields for debugging
        console.log('\nSpecific fields:');
        console.log('main_image:', processedFrontmatter.main_image);
        if (processedFrontmatter.gallery_images) {
          console.log('gallery_images:');
          processedFrontmatter.gallery_images.forEach((img, index) => {
            console.log(`  ${index}: ${img}`);
          });
        }

        // Process the main content
        console.log('\nProcessing main content...');
        const processedContent = content.replace(/!\[.*?\]$$(.+?)$$/g, '$1');
        console.log('\nProcessed main content (first 200 characters):');
        console.log(processedContent.slice(0, 200) + '...');
      }
    }
  } catch (error) {
    console.error('Error processing Markdown files:', error);
    console.error(error.stack);
  }
}

// Test with sample strings
console.log('\nTesting sample strings:');
const testStrings = [
  "'![](images/test.svg)'",
  '![](images/test.svg)',
  'normal string',
  "'normal string'",
  '"![](images/test.svg)"',
  '![Alt text](images/test.svg)',
  '"![Alt text](images/test.svg)"'
];
testStrings.forEach(str => {
  console.log(`\nInput: ${str}`);
  console.log(`Output: ${removeImageSyntax(str)}`);
});

// Process all files
testMarkdownProcessing().catch(console.error);