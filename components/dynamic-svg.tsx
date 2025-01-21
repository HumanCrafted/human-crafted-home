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
  const isSvg = svg.toLowerCase().endsWith(".svg")

  // Ensure the svg path starts with a forward slash
  const imagePath = svg.startsWith("/") ? svg : `/${svg}`

  return (
    <Image
      src={imagePath || "/placeholder.svg"}
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
        console.error("Error loading image:", svg)
        if (onError) onError(new Error(`Failed to load image: ${svg}`))
      }}
    />
  )
}

