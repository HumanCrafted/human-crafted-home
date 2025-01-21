import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground theme-transition">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[60px]">
        <h1 className="text-4xl font-bold mb-6">About</h1>
        <p>This is the About page. Content coming soon.</p>
      </main>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}

