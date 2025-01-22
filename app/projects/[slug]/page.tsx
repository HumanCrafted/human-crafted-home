import Image from "next/image"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { fetchProjectContent, listProjects } from "@/lib/markdown"
import { notFound } from "next/navigation"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const slug = params.slug
  const { metadata, content } = await fetchProjectContent(slug)

  if (!metadata || !content) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[60px]">
        <h1 className="text-4xl font-bold mb-6 font-sans">{metadata.title}</h1>
        <div className="mb-8 relative w-full aspect-square max-w-2xl mx-auto">
          <Image
            src={
              metadata.main_image.startsWith("/")
                ? metadata.main_image
                : `/images/${metadata.main_image.replace(/^images\//, "")}`
            }
            alt={metadata.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-lg object-contain"
          />
        </div>
        <div
          className="prose prose-lg dark:prose-invert max-w-none space-y-4 [&>p]:mb-4 [&>p>br]:content-[''] [&>p>br]:block [&>p>br]:mt-4 font-sans"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>
      <Footer />
    </div>
  )
}

export async function generateStaticParams() {
  const projects = await listProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

