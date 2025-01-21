import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

function adjustImagePaths(content: string): string {
  return content.replace(/!\[(.+?)\]\(\.\/images\//g, "![[$1]](/images/")
}

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

export interface PageContent {
  content: string
  metadata: {
    title: string
    description: string
  }
}

export async function getProjectSlugs() {
  return fs.readdirSync(projectsDirectory)
}

export async function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "")
  const fullPath = path.join(projectsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    slug: realSlug,
    metadata: data as ProjectMetadata,
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

export async function getPageContent(pageName: string): Promise<PageContent> {
  const fullPath = path.join(contentDirectory, `${pageName}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    content: adjustImagePaths(contentHtml),
    metadata: {
      title: data.title,
      description: data.description,
    },
  }
}

