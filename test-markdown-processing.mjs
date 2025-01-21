import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDirectory = path.join(__dirname, 'projects');

function remarkImagePlugin() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'image') {
        node.type = 'html';
        node.value = `<img src="${node.url}" alt="${node.alt || ''}" />`;
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

async function processMarkdown(content) {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkImagePlugin)
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
        const { content } = matter(fileContent);
        
        console.log('Original content:');
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