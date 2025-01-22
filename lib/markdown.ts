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
}

export interface ContentMetadata {
  title: string
  description: string
}

function removeImageMarkdownSyntax(content: string): string {
  const regex = /!\[.*?\]$$(.*?)$$/g
  return content.replace(regex, "$1")
}

function processMetadata(metadata: any): ProjectMetadata | ContentMetadata {
  const processedMetadata: any = {}
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "string") {
      processedMetadata[key] = removeImageMarkdownSyntax(value)
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
          const newNodes = lines.flatMap((line, i) => {
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
    .use(preserveLineBreaks)
    .use(remarkHtml, { sanitize: false })
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
  const contentWithoutImageSyntax = removeImageMarkdownSyntax(content)

  const processedContent = await remark()
    .use(remarkGfm)
    .use(preserveLineBreaks)
    .use(remarkHtml, { sanitize: false })
    .process(contentWithoutImageSyntax)

  const contentHtml = processedContent.toString()

  return {
    metadata: processedMetadata,
    content: contentHtml,
  }
}

