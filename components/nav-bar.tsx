import Link from "next/link"

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Human Crafted
        </Link>
        <div className="space-x-4">
          <Link href="/about" className="text-lg">
            About
          </Link>
          <Link href="/lab" className="text-lg">
            Lab
          </Link>
        </div>
      </div>
    </nav>
  )
}

