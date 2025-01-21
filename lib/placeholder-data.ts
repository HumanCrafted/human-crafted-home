import { Project } from '@/types/project'

export const placeholderProjects: Project[] = [
  {
    id: '1',
    title: 'Project Alpha',
    slug: 'project-alpha',
    main_image: '/placeholder.svg?height=400&width=600',
    featured: true,
    categories: ['Web Design', 'UX'],
    published_date: '2023-06-01',
  },
  {
    id: '2',
    title: 'Project Beta',
    slug: 'project-beta',
    main_image: '/placeholder.svg?height=400&width=600',
    featured: false,
    categories: ['Mobile App', 'UI'],
    published_date: '2023-05-15',
  },
  {
    id: '3',
    title: 'Project Gamma',
    slug: 'project-gamma',
    main_image: '/placeholder.svg?height=400&width=600',
    featured: false,
    categories: ['Branding', 'Graphic Design'],
    published_date: '2023-04-30',
  },
]

export async function fetchProjectContent(slug: string): Promise<string> {
  // In a real implementation, this would fetch from GitHub
  // For now, we'll return placeholder content
  const placeholderContent = `
# ${slug}

This is placeholder content for ${slug}. In a real implementation, this content would be fetched from a GitHub repository.

## Features

- Feature 1
- Feature 2
- Feature 3

## Technologies Used

- Technology 1
- Technology 2
- Technology 3
`

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return placeholderContent
}

