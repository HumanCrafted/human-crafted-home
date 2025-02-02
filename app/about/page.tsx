import { getContentBySlug } from "@/lib/markdown"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

export default async function About() {
  const { metadata, content } = await getContentBySlug("about")

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[5%] pt-[20vh]">
        <section className="mb-24 h-[40vh] flex items-center">
          <div className="max-w-[800px]">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal font-mono mb-4">
              {metadata.title}
            </h1>
          </div>
        </section>
        <div
          className="prose prose-lg dark:prose-invert max-w-none space-y-4 [&>p]:mb-4 [&>p>br]:content-[''] [&>p>br]:block [&>p>br]:mt-4 md:w-[70%]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}