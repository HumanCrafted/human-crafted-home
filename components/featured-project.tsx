"use client"

import Link from "next/link"
import type { Project } from "@/types/project"
import { SyntheticEvent } from "react"

interface FeaturedProjectProps {
  project: Project
}

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("FeaturedProject error:", event)
  }

  return (
    <Link href={`/projects/${project.slug}`} className="block w-full h-full relative group">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative aspect-square w-full max-w-md">
          <img
            src={project.main_image}
            alt={project.title}
            className="w-full h-full transition-transform duration-300 group-hover:scale-105 svg-darkmode inline-image"
            onError={handleError}
          />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-sm font-medium">{project.title}</h3>
        </div>
      </div>
    </Link>
  )
}

