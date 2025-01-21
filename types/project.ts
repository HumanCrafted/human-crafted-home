export interface Project {
  title: string
  slug: string
  main_image: string
  featured: boolean
  categories: string[]
  published_date: string
}

export interface ProjectDetail extends Project {
  content: string
}

