import { NextResponse } from "next/server"
import { fetchProjectContent } from "@/lib/markdown"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug
  try {
    const projectContent = await fetchProjectContent(slug)
    if (!projectContent.metadata) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json(projectContent)
  } catch (error) {
    console.error("Error fetching project content:", error)
    return NextResponse.json({ error: "Failed to fetch project content" }, { status: 500 })
  }
}

