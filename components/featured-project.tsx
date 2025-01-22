"use client"

import Link from "next/link"
import { DynamicSvg } from "./dynamic-svg"
import type { Project } from "@/types/project"

interface FeaturedProjectProps {
  project: Project
}

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const handleError = (error: Error) => {
    console.error("FeaturedProject error:", error)
  }

  return (
    <Link href={`/projects/${project.slug}`} className="block w-full h-full relative group">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative aspect-square w-full max-w-md">
          <DynamicSvg
            svg={project.main_image}
            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
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

