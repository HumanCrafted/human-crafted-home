import { NextResponse } from "next/server"
import { fetchProjectContent } from "@/lib/markdown"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.pathname.split('/').pop()

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

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

