'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { ProjectDetail } from '@/types/project'
import { DynamicSvg } from '@/components/dynamic-svg'

const GITHUB_RAW_CONTENT_URL = 'https://raw.githubusercontent.com/HumanCrafted/Human-Crafted-Home/main'

export default function ProjectPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${slug}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProject(data)
      } catch (e) {
        setError('Failed to load project. Please try again later.')
        console.error('Error fetching project:', e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [slug])

  const getFullImagePath = (src: string) => {
    if (src.startsWith('http')) {
      return src
    }
    return `${GITHUB_RAW_CONTENT_URL}/${src.replace(/^\//, '')}`
  }

  const CustomImage = ({ src, alt }: { src: string; alt: string }) => {
    const fullSrc = getFullImagePath(src)
    const isSvg = fullSrc.toLowerCase().endsWith('.svg')

    if (isSvg) {
      return (
        <DynamicSvg
          svg={fullSrc}
          className="w-full h-auto my-4"
        />
      )
    } else {
      return (
        <Image
          src={fullSrc || "/placeholder.svg"}
          alt={alt}
          width={600}
          height={400}
          className="w-full h-auto my-4"
        />
      )
    }
  }

  const preprocessContent = (content: string) => {
    return content.replace(
      /!\[([^\]]*)\]$$(.*?)$$/g,
      (match, alt, src) => `<CustomImage src="${src}" alt="${alt}" />`
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-mono">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[60px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-foreground border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : project ? (
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
            <ReactMarkdown components={{
              p: ({ node, ...props }) => {
                const children = React.Children.toArray(props.children)
                if (children.length === 1 && React.isValidElement(children[0]) && (children[0].type === CustomImage || children[0].type === 'img')) {
                return children[0]
              }
              return <p {...props} className="text-foreground" />
            },
            h1: ({ node, ...props }) => <h1 {...props} className="text-foreground text-4xl font-bold mb-6" />,
            h2: ({ node, ...props }) => <h2 {...props} className="text-foreground text-3xl font-bold mb-4" />,
            h3: ({ node, ...props }) => <h3 {...props} className="text-foreground text-2xl font-bold mb-3" />,
            h4: ({ node, ...props }) => <h4 {...props} className="text-foreground text-xl font-bold mb-2" />,
            h5: ({ node, ...props }) => <h5 {...props} className="text-foreground text-lg font-bold mb-2" />,
            h6: ({ node, ...props }) => <h6 {...props} className="text-foreground text-base font-bold mb-2" />,
            ul: ({ node, ...props }) => <ul {...props} className="text-foreground list-disc pl-5 mb-4" />,
            ol: ({ node, ...props }) => <ol {...props} className="text-foreground list-decimal pl-5 mb-4" />,
            li: ({ node, ...props }) => <li {...props} className="text-foreground mb-1" />,
            a: ({ node, ...props }) => <a {...props} className="text-accent hover:underline" />,
            img: ({ node, ...props }) => <CustomImage src={props.src || ''} alt={props.alt || ''} />,
            CustomImage: CustomImage
          }}>
            {preprocessContent(project.content)}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="text-center text-foreground">Project not found</div>
      )}
    </main>
    <Footer />
  </div>
)
}

