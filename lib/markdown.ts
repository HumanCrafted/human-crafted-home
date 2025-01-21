import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"

const projectsDirectory = path.join(process.cwd(), "projects")

export interface ProjectMetadata {
  title: string
  slug: string
  main_image: string
  featured: boolean
  categories: string[]
  published_date: string
}

function removeImageMarkdownSyntax(content: string): string {
  const regex = /!\[.*?\]\((.*?)\)/g
  return content.replace(regex, "$1")
}

function processMetadata(metadata: any): ProjectMetadata {
  const processedMetadata: any = {}
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "string") {
      processedMetadata[key] = removeImageMarkdownSyntax(value)
    } else {
      processedMetadata[key] = value
    }
  }
  return processedMetadata as ProjectMetadata
}

export async function getProjectSlugs() {
  return fs.readdirSync(projectsDirectory)
}

export async function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "")
  const fullPath = path.join(projectsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const processedMetadata = processMetadata(data)
  const contentWithoutImageSyntax = removeImageMarkdownSyntax(content)

  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(contentWithoutImageSyntax)

  const contentHtml = processedContent.toString()

  console.log("Processed HTML content:", contentHtml)

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
  const { metadata, content } = await getProjectBySlug(slug)
  return { metadata, content }
}

export async function listProjects() {
  return getAllProjects()
}

