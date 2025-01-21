import Link from "next/link"
import { DynamicSvg } from "./dynamic-svg"
import type { Project } from "@/types/project"

interface ProjectGridProps {
  projects: Project[]
  onError?: (error: Error) => void
}

export function ProjectGrid({ projects, onError }: ProjectGridProps) {
  if (!projects?.length) {
    return (
      <div className="text-center py-8">
        <p>No projects found. Check back later for updates!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {projects.map((project) => (
        <Link href={`/projects/${project.slug}`} key={project.slug} className="group">
          <div className="relative aspect-square mb-4">
            <DynamicSvg
              svg={project.main_image}
              className="w-full h-full transition-transform duration-300 group-hover:scale-105"
              onError={onError}
            />
          </div>
          <h3 className="text-sm text-center">{project.title}</h3>
        </Link>
      ))}
    </div>
  )
}

