"use client"

import { useRef, useEffect } from "react"
import { TableOfContents } from "@/components/table-of-contents"

interface MoreContentProps {
  content: string
}

export function MoreContent({ content }: MoreContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  // Add IDs to headings after the component mounts
  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll("h3")
      headings.forEach((heading) => {
        if (!heading.id) {
          heading.id = heading.textContent?.toLowerCase().replace(/\s+/g, "-") || ""
        }
      })
    }
  }, [content])

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="prose prose-lg dark:prose-invert max-w-none space-y-4 [&>p]:mb-4 [&>p>br]:content-[''] [&>p>br]:block [&>p>br]:mt-4 md:w-[70%]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <TableOfContents contentRef={contentRef} />
    </div>
  )
}

