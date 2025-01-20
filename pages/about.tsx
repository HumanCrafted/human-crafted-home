import type { GetStaticProps } from "next"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { getPageContent, type PageContent } from "@/lib/markdown"

interface AboutProps {
  pageContent: PageContent
}

export default function About({ pageContent }: AboutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[60px]">
        <h1 className="text-4xl font-bold mb-6">{pageContent.metadata.title}</h1>
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: pageContent.content }}
        />
      </main>
      <Footer />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const pageContent = await getPageContent("about")
  return {
    props: {
      pageContent,
    },
  }
}

