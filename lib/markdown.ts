import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"
import { visit } from "unist-util-visit"

const projectsDirectory = path.join(process.cwd(), "projects")
const contentDirectory = path.join(process.cwd(), "content")

export interface ProjectMetadata {
  title: string
  slug: string
  main_image: string
  featured: boolean
  categories: string[]
  published_date: string
  gallery_images?: string[]
  headline: string
}

export interface ContentMetadata {
  title: string
  description: string
}

function removeImageMarkdownSyntax(content: string): string {
  const regex = /!\[.*?\]\((.*?)\)/g
  return content.replace(regex, "$1")
}

function processImagePath(imagePath: string): string {
  return imagePath.replace(/^public\//, "")
}

function processMetadata(metadata: any): ProjectMetadata | ContentMetadata {
  const processedMetadata: any = {}
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "string") {
      if (key === "main_image") {
        processedMetadata[key] = processImagePath(removeImageMarkdownSyntax(value))
      } else {
        processedMetadata[key] = removeImageMarkdownSyntax(value)
      }
    } else if (Array.isArray(value) && key === "gallery_images") {
      processedMetadata[key] = value.map(removeImageMarkdownSyntax).map(processImagePath)
    } else {
      processedMetadata[key] = value
    }
  }
  return processedMetadata
}

function preserveLineBreaks() {
  return (tree: any) => {
    visit(tree, "text", (node, index, parent) => {
      if (typeof node.value === "string") {
        const lines = node.value.split("\n")
        if (lines.length > 1) {
          const newNodes = lines.flatMap((line: string, i: number) => {
            if (i === lines.length - 1) return [{ type: "text", value: line }]
            return [
              { type: "text", value: line },
              { type: "html", value: "<br>" },
            ]
          })
          parent.children.splice(index, 1, ...newNodes)
          return index + newNodes.length
        }
      }
    })
  }
}

function processInlineImages() {
  return (tree: any) => {
    visit(tree, "image", (node: any) => {
      const url = node.url.replace(/^public\//, "")
      const processedUrl = url.startsWith("/") 
        ? url 
        : url.startsWith("images/")
          ? `/${url}`
          : `/images/${url}`

      node.type = 'html'
      const isSvg = processedUrl.toLowerCase().endsWith('.svg')
      
      if (isSvg) {
        node.value = `<img src="${processedUrl}" alt="${node.alt || ''}" class="inline-image h-auto svg-darkmode" />`
      } else {
        node.value = `<img src="${processedUrl}" alt="${node.alt || ''}" class="inline-image h-auto" />`
      }
    })
  }
}

function processInternalLinks() {
  return (tree: any) => {
    visit(tree, "text", (node, index, parent) => {
      if (typeof node.value === "string") {
        const linkRegex = /\[\[(.*?)\]\]/g
        const matches = [...node.value.matchAll(linkRegex)]

        if (matches.length > 0) {
          const newNodes = []
          let lastIndex = 0

          matches.forEach((match) => {
            const [fullMatch, linkText] = match
            const matchIndex = match.index!

            if (matchIndex > lastIndex) {
              newNodes.push({
                type: "text",
                value: node.value.slice(lastIndex, matchIndex),
              })
            }

            newNodes.push({
              type: "html",
              value: `<a href="/${linkText.toLowerCase()}">${linkText}</a>`,
            })

            lastIndex = matchIndex + fullMatch.length
          })

          if (lastIndex < node.value.length) {
            newNodes.push({
              type: "text",
              value: node.value.slice(lastIndex),
            })
          }

          parent.children.splice(index, 1, ...newNodes)
        }
      }
    })
  }
}

export async function getProjectSlugs() {
  return fs.readdirSync(projectsDirectory)
}

export async function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "")
  const fullPath = path.join(projectsDirectory, `${realSlug}.md`)

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Project file not found: ${fullPath}`)
  }

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const processedMetadata = processMetadata(data) as ProjectMetadata
  const contentWithoutImageSyntax = removeImageMarkdownSyntax(content)

  const processedContent = await remark()
    .use(remarkGfm)
    .use([preserveLineBreaks])
    .use(remarkHtml as any)
    .process(contentWithoutImageSyntax)

  const contentHtml = processedContent.toString()

  return {
    slug: realSlug,
    metadata: processedMetadata,
    content: contentHtml,
  }
}

export async function getAllProjects() {
  const slugs = await getProjectSlugs()
  const projects = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await getProjectBySlug(slug)
      return {
        ...metadata,
        slug: slug.replace(/\.md$/, ""),
      }
    }),
  )

  return projects.sort((a, b) => (a.published_date > b.published_date ? -1 : 1))
}

export async function fetchProjectContent(slug: string) {
  try {
    const { metadata, content } = await getProjectBySlug(slug)
    return { metadata, content }
  } catch (error) {
    console.error(`Error fetching project content for slug ${slug}:`, error)
    return { metadata: null, content: null }
  }
}

export async function listProjects() {
  return getAllProjects()
}

export async function getContentBySlug(slug: string) {
  const fullPath = path.join(contentDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Content file not found: ${fullPath}`)
  }

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const processedMetadata = processMetadata(data) as ContentMetadata

  const processedContent = await remark()
    .use(remarkGfm)
    .use(processInlineImages)
    .use(preserveLineBreaks)
    .use(processInternalLinks)
    .use(remarkHtml, { sanitize: false })
    .process(content)

  return {
    metadata: processedMetadata,
    content: processedContent.toString(),
  }
}