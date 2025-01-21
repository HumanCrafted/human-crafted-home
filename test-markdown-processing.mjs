import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDirectory = path.join(__dirname, 'projects');

function removeImageSyntax(str) {
  // This regex will match the entire image syntax, including extra spaces
  return str.replace(/!\s*\[([^\]]*)\]\s*$$([^)]+)$$/g, '$2');
}

function processYamlMetadata(metadata) {
  if (typeof metadata === 'string') {
    return removeImageSyntax(metadata);
  }
  if (Array.isArray(metadata)) {
    return metadata.map(item => processYamlMetadata(item));
  }
  if (typeof metadata === 'object' && metadata !== null) {
    const processedMetadata = {};
    for (const [key, value] of Object.entries(metadata)) {
      processedMetadata[key] = processYamlMetadata(value);
    }
    return processedMetadata;
  }
  return metadata;
}

async function processMarkdown(content) {
  // First, remove image syntax from the content
  content = removeImageSyntax(content);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);

  return processedContent.toString();
}

async function testMarkdownProcessing() {
  try {
    const files = await fs.readdir(projectsDirectory);
    
    for (const file of files) {
      if (path.extname(file) === '.md') {
        console.log(`Processing file: ${file}`);
        const fullPath = path.join(projectsDirectory, file);
        const fileContent = await fs.readFile(fullPath, 'utf8');
        const { data: frontmatter, content } = matter(fileContent);
        
        console.log('Original frontmatter:');
        console.log(yaml.dump(frontmatter));
        console.log('\nProcessed frontmatter:');
        const processedFrontmatter = processYamlMetadata(frontmatter);
        console.log(yaml.dump(processedFrontmatter));
        
        console.log('\nOriginal content:');
        console.log(content);
        console.log('\nProcessed content:');
        const processedContent = await processMarkdown(content);
        console.log(processedContent);
        console.log('\n---\n');
      }
    }
  } catch (error) {
    console.error('Error processing Markdown files:', error);
  }
}

testMarkdownProcessing().catch(console.error);