import { fetchProjectContent } from './lib/github'

async function testGitHubIntegration() {
  try {
    console.log('Fetching project-alpha content...')
    const content = await fetchProjectContent('project-alpha')
    console.log('Content fetched successfully:')
    console.log(content)
  } catch (error) {
    console.error('Error:', error)
  }
}

testGitHubIntegration()

