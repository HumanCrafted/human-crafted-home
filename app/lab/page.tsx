import { getContentBySlug } from "@/lib/markdown"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

export default async function Lab() {
  const { metadata, content } = await getContentBySlug("lab")

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[5%]">
        <div
          className="prose prose-lg dark:prose-invert max-w-none space-y-4 [&>p]:mb-4 [&>p>br]:content-[''] [&>p>br]:block [&>p>br]:mt-4 font-sans"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}

