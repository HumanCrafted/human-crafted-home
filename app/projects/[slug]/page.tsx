import Image from "next/image"
import type { Metadata } from "next"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { fetchProjectContent, listProjects } from "@/lib/markdown"
import { notFound } from "next/navigation"
import { DynamicSvg } from "@/components/dynamic-svg"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const { slug } = await params
  await searchParams // We're not using searchParams, but we need to await it

  const { metadata, content } = await fetchProjectContent(slug)

  if (!metadata || !content) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[5%]">
        <h1 className="text-4xl font-bold mb-6 font-sans">{metadata.title}</h1>
        <div className="mb-8 relative w-full aspect-square max-w-2xl mx-auto">
          {metadata.main_image.toLowerCase().endsWith(".svg") ? (
            <DynamicSvg svg={metadata.main_image} className="w-full h-full object-contain" />
          ) : (
            <Image
              src={
                metadata.main_image.startsWith("/")
                  ? metadata.main_image
                  : metadata.main_image.startsWith("images/")
                    ? `/${metadata.main_image}`
                    : `/images/${metadata.main_image}`
              }
              alt={metadata.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-lg object-contain"
            />
          )}
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { metadata } = await fetchProjectContent(slug)
  return {
    title: metadata?.title || "Project",
    description: metadata?.headline || "",
  }
}

