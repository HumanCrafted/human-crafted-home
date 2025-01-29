import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/projects/')) {
    const projectSlug = pathname.split('/').pop()
    return NextResponse.redirect(new URL(`/?project=${projectSlug}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/projects/:path*',
}