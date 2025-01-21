import type { GetStaticProps, GetStaticPaths } from "next"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { type ProjectMetadata, getProjectBySlug, getProjectSlugs } from "@/lib/github"
import { DynamicSvg } from "@/components/dynamic-svg"

interface ProjectPageProps {
  project: {
    slug: string
    metadata: ProjectMetadata
    content: string
  }
}

export default function ProjectPage({ project }: ProjectPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-mono">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[60px]">
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
          <h1 className="text-4xl font-bold mb-6">{project.metadata.title}</h1>
          <DynamicSvg svg={project.metadata.main_image} className="w-full h-auto my-4" />
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getProjectSlugs()
  return {
    paths: slugs.map((slug) => ({
      params: { slug: slug.replace(/\.md$/, "") },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = await getProjectBySlug(params?.slug as string)
  return {
    props: {
      project,
    },
  }
}

