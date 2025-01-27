"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

interface DynamicSvgProps {
  svg: string
  className?: string
  onError?: (error: Error) => void
}

export function DynamicSvg({ svg, className = "" }: DynamicSvgProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined)

  const isSvg = svg.toLowerCase().endsWith(".svg")

  // Ensure the svg path is correct
  const imagePath = svg.startsWith("/") ? svg : `/images/${svg.replace(/^images\//, "")}`

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setCurrentTheme(theme === "system" ? resolvedTheme : theme)
  }, [theme, resolvedTheme])

  if (!mounted) {
    return null
  }

  return (
    <Image
      src={imagePath || "/placeholder.svg"}
      alt="Project Image"
      width={500}
      height={500}
      className={`w-full h-auto ${className}`}
      style={{
        filter:
          isSvg && currentTheme === "dark"
            ? "invert(91%) sepia(17%) saturate(166%) hue-rotate(1deg) brightness(94%) contrast(88%)"
            : "none",
      }}
      onError={(event) => {
        console.error("Error loading image:", svg, event)
      }}
    />
  )
}

