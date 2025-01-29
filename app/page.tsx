"use client"

import { useState, useEffect, Suspense } from "react"
import { CategoryFilter } from "@/components/category-filter"
import { ProjectGrid } from "@/components/project-grid"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import ScrambledText from "@/components/scrambled-text"
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

  const scrambledWords = ["things", "products", "brands", "websites", "businesses", "our home"]

  return (
    <main className="bg-background text-foreground min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow w-full px-[5%] pt-[20vh]">
        <section className="mb-24 h-[40vh] flex items-center">
          <div className="max-w-[800px]">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal font-mono mb-4">
              A product design studio specializing in the rapid realization of ideas.
            </h1>
            <p className="text-3xl md:text-4xl lg:text-5xl font-normal font-mono">
              We make <ScrambledText words={scrambledWords} interval={5000} /> better.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <div className="w-full h-px bg-foreground mb-8"></div>
          <div className="mb-4 text-lg font-medium font-mono">The Archive ↓</div>
          <CategoryFilter tags={allTags} onSelectTag={handleTagSelect} selectedTag={selectedTag} />
          <Suspense fallback={<div className="text-center py-8">Loading projects...</div>}>
            <ProjectGrid
              projects={projects}
              selectedTag={selectedTag}
              onSelectTag={handleTagSelect}
              onError={(e) => console.error("Error loading project image:", e)}
            />
          </Suspense>
        </section>
      </div>
      <Footer />
    </main>
  )
}

