import { getContentBySlug } from "@/lib/markdown"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

export default async function Lab() {
  const { metadata, content } = await getContentBySlug("lab")

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
        <div className="mt-8">
            <a
            href="mailto:jon@humancrafted.co"
            className="mt-6 font-bold px-5 py-1 bg-foreground text-background hover:bg-accent hover:text-foreground transition-colors rounded-full text-[22px] inline-flex items-center gap-2 w-auto"
            >
            Contact me
            </a>
        </div>
      </main>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}