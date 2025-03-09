import { getContentBySlug } from "@/lib/markdown"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import ScrambledText from "@/components/scrambled-text"
import { MoreContent } from "@/components/more-content"

export default async function More() {
  const { metadata, content } = await getContentBySlug("more")
  const scrambledWords = ["things", "products", "brands", "websites", "businesses", "our home"]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[var(--content-padding)] pt-[20vh]">
        <section className="mb-24 h-[40vh] flex items-center">
          <div className="max-w-[800px]">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal font-mono mb-4">
              We make <ScrambledText words={scrambledWords} interval={5000} /> better.
            </h1>
          </div>
        </section>
        <MoreContent content={content} />
      </main>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}

