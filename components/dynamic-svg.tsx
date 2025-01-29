"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface DynamicSvgProps {
  svg: string
  className?: string
  onError?: (error: Error) => void
}

export function DynamicSvg({ svg, className = "" }: DynamicSvgProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined)
  const [imageError, setImageError] = useState(false)

  const isSvg = svg.toLowerCase().endsWith(".svg")

  // Updated path construction
  const imagePath = svg.startsWith("/")
    ? svg // Keep absolute paths as-is
    : svg.startsWith("public/")
    ? svg.replace("public", "") // Remove 'public' from path
    : svg.startsWith("images/")
    ? `/${svg}` // Add leading slash for images/ paths
    : `/images/${svg}` // Default case: prepend /images/

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
      src={imagePath}
      alt="Project Image"
      width={500}
      height={500}
      className={`w-full h-auto ${className}`}
      onError={(e) => {
        console.error(`Failed to load image: ${imagePath}`)
        setImageError(true)
      }}
      style={{
        filter:
          isSvg && currentTheme === "dark"
            ? "invert(91%) sepia(17%) saturate(166%) hue-rotate(1deg) brightness(94%) contrast(88%)"
            : "none",
      }}
    />
  )
}

