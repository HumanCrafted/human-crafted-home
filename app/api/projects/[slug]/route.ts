import { NextResponse } from 'next/server'
import { fetchProjectContent } from '@/lib/github'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug

  try {
    const { metadata, content } = await fetchProjectContent(slug)
    return NextResponse.json({ ...metadata, content })
  } catch (error) {
    console.error('Error fetching project content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project content' }, 
      { status: 500 }
    )
  }
}

