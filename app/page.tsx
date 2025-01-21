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
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error)
        }
        setProjects(data)
        setIsLoading(false)
      })
      .catch((e) => {
        setError(e.message || "An error occurred while fetching projects")
        setIsLoading(false)
      })
  }, [])

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.categories.includes(selectedCategory))
    : projects

  const featuredProject = projects.find((project) => project.featured)
  const allTags = Array.from(new Set(projects.flatMap((p) => p.categories)))

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow w-full px-[60px]">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
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
            <p className="text-2xl lg:text-3xl max-w-md">
              A product design studio specializing in the rapid realization of ideas.
            </p>
          </div>
          <div className="flex items-center justify-center">
            {isLoading ? (
              <p>Loading featured project...</p>
            ) : featuredProject ? (
              <FeaturedProject
                project={featuredProject}
                onError={(error) => console.error("FeaturedProject error:", error)}
              />
            ) : (
              <p>No featured project available</p>
            )}
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-4 text-lg font-medium font-mono">Idea Archive ↓</div>
          <CategoryFilter tags={allTags} selectedTag={selectedCategory} onSelectTag={setSelectedCategory} />
        </section>

        {isLoading ? <p>Loading projects...</p> : <ProjectGrid projects={filteredProjects} />}
      </main>
      <Footer />
    </div>
  )
}

