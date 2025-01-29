import React from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface ImageModalProps {
  src: string
  alt: string
  onClose: () => void
}

export function ImageModal({ src, alt, onClose }: ImageModalProps) {
  return (
    <div
      className="fixed inset-0 bg-background/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full h-full">
        {src.toLowerCase().endsWith(".svg") ? (
          <img src={src} alt={alt} className="w-full h-full object-contain svg-darkmode inline-image" />
        ) : (
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
          />
        )}
      </div>
      <button
        className="absolute top-4 right-4 text-foreground bg-background/50 rounded-full w-8 h-8 flex items-center justify-center"
        onClick={onClose}
        aria-label="Close modal"
      >
        <X size={60} />
      </button>
    </div>
  )
}

