import Image from "next/image"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { fetchProjectContent, listProjects } from "@/lib/markdown"
import { notFound } from "next/navigation"

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { metadata, content } = await fetchProjectContent(params.slug)

  if (!metadata || !content) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[60px]">
        <h1 className="text-4xl font-bold mb-6">{metadata.title}</h1>
        <div className="mb-8">
          <Image
            src={
              metadata.main_image.startsWith("/")
                ? metadata.main_image
                : `/images/${metadata.main_image.replace(/^images\//, "")}`
            }
            alt={metadata.title}
            width={800}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
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

