"use client"

import { useTheme } from "next-themes"
import Image from "next/image"

interface DynamicSvgProps {
  svg: string
  className?: string
  onError?: (error: Error) => void
}

export function DynamicSvg({ svg, className = "", onError }: DynamicSvgProps) {
  const { theme } = useTheme()

  // Extract src from img tag if present
  const srcMatch = svg.match(/<img.*?src="(.*?)"/)
  const src = srcMatch ? srcMatch[1] : svg

  const isSvg = src.toLowerCase().endsWith(".svg")

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt="SVG Image"
      width={500}
      height={500}
      className={`w-full h-auto ${className}`}
      style={{
        filter:
          isSvg && theme === "dark"
            ? "invert(91%) sepia(17%) saturate(166%) hue-rotate(1deg) brightness(94%) contrast(88%)"
            : "none",
      }}
      onError={(e) => {
        console.error("Error loading image:", src)
        if (onError) onError(new Error(`Failed to load image: ${src}`))
      }}
    />
  )
}

