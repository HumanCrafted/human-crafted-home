import { NextResponse } from 'next/server'
import { listProjects } from '@/lib/github'

export async function GET() {
  try {
    const projects = await listProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('API: Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

