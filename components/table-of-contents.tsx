"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface TOCItem {
  id: string
  text: string
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLDivElement>
}

export function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const tocRef = useRef<HTMLDivElement>(null)

  // Extract headings from content
  useEffect(() => {
    if (!contentRef.current) return

    const elements = Array.from(contentRef.current.querySelectorAll("h3"))

    // Ensure all headings have unique IDs
    elements.forEach((element, index) => {
      if (!element.id || element.id === "") {
        const text = element.textContent || ""
        element.id = text.toLowerCase().replace(/\s+/g, "-") || `heading-${index}`
      }
    })

    // Now extract the headings with their IDs
    const items: TOCItem[] = elements.map((element) => {
      return {
        id: element.id,
        text: element.textContent || `Heading ${elements.indexOf(element) + 1}`,
      }
    })

    setHeadings(items)
  }, [contentRef])

  // Handle scroll to update active heading
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      // Find the current active heading
      const headingElements = Array.from(contentRef.current.querySelectorAll("h3"))
      const headingPositions = headingElements.map((element) => {
        return {
          id: element.id,
          position: element.getBoundingClientRect().top,
        }
      })

      // Check if we're at the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100

      if (isAtBottom && headingElements.length > 0) {
        // If at the bottom, highlight the last heading
        setActiveId(headingElements[headingElements.length - 1].id)
      } else {
        // Otherwise, find the heading that's currently at the top of the viewport
        const currentHeading = headingPositions.filter((heading) => heading.position < 200).slice(-1)[0]

        if (currentHeading) {
          setActiveId(currentHeading.id)
        } else if (headingPositions.length > 0 && window.scrollY < 200) {
          setActiveId("")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once to set initial state

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [contentRef])

  if (headings.length === 0) {
    return null
  }

  return (
    <div
      ref={tocRef}
      className="fixed w-64 bg-background text-right"
      style={{
        top: "180px",
        right: "var(--content-padding)",
        maxWidth: "calc(30% - var(--content-padding))",
      }}
    >
      <div className="font-mono text-sm font-bold mb-2">On this page</div>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <li key={`toc-${heading.id || index}`}>
              <a
                href={`#${heading.id}`}
                className={`block text-sm py-1 font-mono underline decoration-solid hover:decoration-wavy transition-all ${
                  activeId === heading.id ? "font-medium" : "decoration-transparent"
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(heading.id)
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                    // Update URL without full page reload
                    window.history.pushState(null, "", `#${heading.id}`)
                    // Force active state update
                    setActiveId(heading.id)
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

