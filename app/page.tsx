import { listProjects } from "@/lib/markdown"
import { CategoryFilter } from "@/components/category-filter"
import { ProjectGrid } from "@/components/project-grid"
import { FeaturedProject } from "@/components/featured-project"
import { ScalableText } from "@/components/scalable-text"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import type { Project } from "@/types/project"
import ClientWrapper from "@/components/client-wrapper"

export default async function Home() {
  const projects = await listProjects()
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
            {featuredProject ? (
              <ClientWrapper>
                <FeaturedProject
                  project={featuredProject}
                  onError={(error) => console.error("FeaturedProject error:", error)}
                />
              </ClientWrapper>
            ) : (
              <p>No featured project available</p>
            )}
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-4 text-lg font-medium font-mono">Idea Archive ↓</div>
          <ClientWrapper>
            <CategoryFilter tags={allTags} selectedTag={null} onSelectTag={() => {}} />
          </ClientWrapper>
        </section>

        <ProjectGrid projects={projects} />
      </main>
      <Footer />
    </div>
  )
}

