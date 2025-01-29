"use client"

import React, { useRef, useEffect, useState } from "react"

interface ScalableTextProps {
  children: React.ReactNode
  className?: string
  minFontSize?: number
  maxFontSize?: number
  highlightText?: string
  showHighlight?: boolean
}

export function ScalableText({
  children,
  className = "",
  minFontSize = 16,
  maxFontSize = 128,
  highlightText,
  showHighlight = true,
}: ScalableTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(maxFontSize)

  useEffect(() => {
    const resizeText = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const containerHeight = containerRef.current.offsetHeight
        let low = minFontSize
        let high = maxFontSize
        let mid

        while (low <= high) {
          mid = Math.floor((low + high) / 2)
          textRef.current.style.fontSize = `${mid}px`

          if (textRef.current.scrollWidth <= containerWidth && textRef.current.scrollHeight <= containerHeight) {
            low = mid + 1
          } else {
            high = mid - 1
          }
        }

        setFontSize(high)
      }
    }

    resizeText()
    window.addEventListener("resize", resizeText)
    return () => window.removeEventListener("resize", resizeText)
  }, [children, minFontSize, maxFontSize])

  const highlightedContent =
    highlightText && showHighlight
      ? React.Children.map(children, (child) => {
          if (typeof child === "string") {
            const regex = new RegExp(`(${highlightText})`, "g")
            const parts = child.split(regex)
            return parts.map((part, index) => {
              if (part === highlightText) {
                return (
                  <span key={index} className="relative inline-block">
                    <span className="relative z-10">{part}</span>
                    <span
                      className="absolute left-0 bottom-0 w-full h-[35%] bg-accent mix-blend-darken dark:mix-blend-lighten"
                      style={{
                        zIndex: -1,
                      }}
                    />
                  </span>
                )
              }
              return part
            })
          }
          return child
        })
      : children

  return (
    <div ref={containerRef} className={`w-full h-full overflow-hidden ${className}`}>
      <div
        ref={textRef}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.2,
          whiteSpace: "pre-wrap",
          position: "relative",
          display: "inline-block",
          zIndex: 1,
        }}
      >
        {highlightedContent}
      </div>
    </div>
  )
}

 