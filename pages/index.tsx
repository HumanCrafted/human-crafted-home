import type { GetStaticProps } from "next"
import { useState } from "react"
import { CategoryFilter } from "@/components/category-filter"
import { ProjectGrid } from "@/components/project-grid"
import { FeaturedProject } from "@/components/featured-project"
import { ScalableText } from "@/components/scalable-text"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { type ProjectMetadata, getAllProjects, getPageContent, type PageContent } from "@/lib/markdown"

interface HomeProps {
  projects: ProjectMetadata[]
  pageContent: PageContent
}

export default function Home({ projects, pageContent }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.categories.includes(selectedCategory))
    : projects

  const featuredProject = projects.find((project) => project.featured)
  const allTags = Array.from(new Set(projects.flatMap((p) => p.categories)))

  return (
    <>
      <NavBar />
      <main className="flex-grow w-full px-[60px]">
        <section className="pt-32 mb-24 relative h-[88vh] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-col justify-between">
            <div className="flex-1 flex flex-col justify-center">
              <ScalableText
                className="font-bold font-sans whitespace-nowrap mb-4 lg:mb-8 text-foreground"
                minFontSize={32}
                maxFontSize={150}
                highlight
              >
                {pageContent.metadata.title}
              </ScalableText>
            </div>
            <div className="text-2xl lg:text-3xl max-w-md" dangerouslySetInnerHTML={{ __html: pageContent.content }} />
          </div>
          <div className="flex items-center justify-center">
            {featuredProject ? (
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

        <ProjectGrid projects={filteredProjects} />
      </main>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const projects = await getAllProjects()
  const pageContent = await getPageContent("home")
  return {
    props: {
      projects,
      pageContent,
    },
  }
}

