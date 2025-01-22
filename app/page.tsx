"use client"

import { useState, useEffect } from "react"
import { CategoryFilter } from "@/components/category-filter"
import { ProjectGrid } from "@/components/project-grid"
import { FeaturedProject } from "@/components/featured-project"
import { ScalableText } from "@/components/scalable-text"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import type { Project } from "@/types/project"

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
  }, [])

  const featuredProject = projects.find((project) => project.featured)
  const allTags = Array.from(new Set(projects.flatMap((p) => p.categories)))

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow w-full px-[60px]">
        <section className="pt-32 mb-24 relative h-[82vh] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-col justify-between">
            <div className="flex-1 flex flex-col justify-center">
              <ScalableText
                className="font-bold font-sans whitespace-nowrap mb-4 lg:mb-8 text-foreground"
                minFontSize={32}
                maxFontSize={150}
                highlight
              >
                Made Better.
              </ScalableText>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {featuredProject ? <FeaturedProject project={featuredProject} /> : <p>No featured project available</p>}
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-4 text-lg font-medium font-mono">Idea Archive ↓</div>
          <CategoryFilter tags={allTags} onSelectTag={setSelectedTag} />
        </section>

        <ProjectGrid projects={projects} selectedTag={selectedTag} />
      </main>
      <Footer />
    </div>
  )
}

