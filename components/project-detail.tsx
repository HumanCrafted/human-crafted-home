"use client"

import { useState, useEffect } from "react"
import { DynamicSvg } from "./dynamic-svg"
import { ImageGallery } from "./image-gallery"
import { X } from "lucide-react"
import type { Project } from "@/types/project"

interface ProjectDetailProps {
  project: Project
  onClose: () => void
  onCategoryClick: (category: string) => void
}

export function ProjectDetail({ project, onClose, onCategoryClick }: ProjectDetailProps) {
  // console.log("Rendering ProjectDetail for project:", project.title)
  const [fullContent, setFullContent] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFullContent() {
      try {
        const response = await fetch(`/api/projects/${project.slug}`)
        if (!response.ok) {
          throw new Error("Failed to fetch project details")
        }
        const data = await response.json()
        setFullContent(data.content)
      } catch (error) {
        console.error("Error fetching project details:", error)
      }
    }

    fetchFullContent()
  }, [project.slug])

  const handleCategoryClick = (category: string) => {
    onClose()
    onCategoryClick(category)
  }

  return (
    <div className="bg-background rounded-lg overflow-hidden font-mono" data-testid="project-detail">
      <div className="relative">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClose()
          }}
          className="absolute top-2 right-2 text-foreground hover:text-accent z-10 bg-background bg-opacity-50 rounded-full p-1"
        >
          <X size={48} />
        </button>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-[30%] p-6">
          <div className="aspect-square relative">
            <DynamicSvg svg={project.main_image} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-lg text-center mt-4">{project.title}</h3>
        </div>
        <div className="md:w-[70%] p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 [&>p]:mb-4 [&>p>br]:content-[''] [&>p>br]:block [&>p>br]:mt-4 font-mono">
            <p className="font-medium">{project.headline}</p>
            <div className="flex items-center gap-2">
              <p>[{new Date(project.published_date).toLocaleDateString()}]</p>
              <p>-</p>
              <p>
                {project.categories.map((category, index) => (
                  <span key={category}>
                    {index > 0 && ", "}
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="underline decoration-solid hover:decoration-wavy focus:outline-none"
                    >
                      {category}
                    </button>
                  </span>
                ))}
              </p>
             
            </div>
            {fullContent && <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: fullContent }} />}
          </div>
          {project.gallery_images && project.gallery_images.length > 0 && (
            <div className="mt-6">
              <ImageGallery images={project.gallery_images} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

