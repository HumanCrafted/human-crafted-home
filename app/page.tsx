"use client"

import { useState, useEffect } from "react"
import { CategoryFilter } from "@/components/category-filter"
import { ProjectGrid } from "@/components/project-grid"
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

  const allTags = Array.from(new Set(projects.flatMap((p) => p.categories)))

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag)
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow w-full px-[60px]">
        <section className="pt-32 mb-24 relative h-[60vh] grid grid-cols-1 lg:grid-cols-1 gap-8 lg:gap-16">
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
            <p className="text-3xl lg:text-4xl max-w-md">
              A product design studio specializing in the rapid realization of ideas.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <div className="w-full h-px bg-foreground mb-8"></div>
          <div className="mb-4 text-lg font-medium font-mono">Idea Archive ↓</div>
          <CategoryFilter tags={allTags} onSelectTag={handleTagSelect} selectedTag={selectedTag} />
        </section>

        <ProjectGrid projects={projects} selectedTag={selectedTag} onSelectTag={handleTagSelect} />
      </main>
      <Footer />
    </div>
  )
}

