import path from "path"
import fs from "fs"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import remarkUnwrapImages from "remark-unwrap-images"

interface ProjectMetadata {
  title: string
  date: string
  tags: string[]
}

const projectsDirectory = path.join(process.cwd(), "data")

export async function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "")
  const fullPath = path.join(projectsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const processedContent = await remark().use(html).use(remarkUnwrapImages).process(content)
  const contentHtml = processedContent.toString()

  return {
    slug: realSlug,
    metadata: data as ProjectMetadata,
    content: contentHtml,
  }
}

export async function getAllProjects() {
  const fileNames = fs.readdirSync(projectsDirectory)
  const allProjectsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "")
    const fullPath = path.join(projectsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const matterResult = matter(fileContents)

    return {
      slug,
      ...matterResult.data,
    }
  })
  return allProjectsData
}

function adjustImagePaths(content: string): string {
  // Handle Markdown image syntax
  content = content.replace(/!\[(.+?)\]\(\.\/images\//g, "![[$1]](/images/")

  // Handle HTML image syntax
  content = content.replace(/<img src="\.\/images\//g, '<img src="/images/')

  return content
}

