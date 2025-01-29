import { NextResponse } from "next/server"
import { listProjects } from "@/lib/markdown"

export async function GET() {
  try {
    const projects = await listProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

