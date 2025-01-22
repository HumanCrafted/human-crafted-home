import { getContentBySlug } from "@/lib/markdown"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

export default async function Lab() {
  const { metadata, content } = await getContentBySlug("lab")

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground theme-transition">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[60px]">
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </main>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}

