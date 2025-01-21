import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'

export default function Lab() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground theme-transition">
      <NavBar />
      <main className="flex-grow pt-32 w-full px-[60px]">
        <h1 className="text-4xl font-bold mb-6">Co/Lab</h1>
        <p>Welcome to the Co/Lab page. Content coming soon.</p>
      </main>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}

