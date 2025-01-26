import { useState, useEffect } from "react"
import { DynamicSvg } from "./dynamic-svg"
import { ProjectDetail } from "./project-detail"
import type { Project } from "@/types/project"

interface ProjectGridProps {
  projects: Project[]
  selectedTag: string | null
  onSelectTag: (tag: string | null) => void
  onError?: (error: Error) => void
}

export function ProjectGrid({ projects, selectedTag, onSelectTag, onError }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const filteredProjects = selectedTag
    ? projects.filter((project) => project.categories.includes(selectedTag))
    : projects

  useEffect(() => {
    if (selectedProject) {
      const currentProject = projects.find((p) => p.slug === selectedProject)
      if (currentProject && selectedTag && !currentProject.categories.includes(selectedTag)) {
        setSelectedProject(null)
      }
    }
  }, [selectedTag, selectedProject, projects])

  if (!filteredProjects?.length) {
    return (
      <div className="text-center py-8">
        <p>No projects found. Check back later for updates!</p>
      </div>
    )
  }

  const handleProjectClick = (slug: string) => {
    setSelectedProject((prevSelected) => (prevSelected === slug ? null : slug))
  }

  const handleCloseProject = () => {
    setSelectedProject(null)
  }

  const handleCategoryClick = (category: string) => {
    onSelectTag(category)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {filteredProjects.map((project) => (
        <div key={project.slug} className={selectedProject === project.slug ? "col-span-full" : ""}>
          <button
            className={`group text-left w-full ${selectedProject === project.slug ? "hidden" : ""}`}
            onClick={() => handleProjectClick(project.slug)}
          >
            <div className="relative aspect-square mb-4">
              <DynamicSvg
                svg={project.main_image}
                className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                onError={onError}
              />
            </div>
            <h3 className="text-lg text-center font-mono">{project.title}</h3>
          </button>
          {selectedProject === project.slug && (
            <ProjectDetail project={project} onClose={handleCloseProject} onCategoryClick={handleCategoryClick} />
          )}
        </div>
      ))}
    </div>
  )
}

