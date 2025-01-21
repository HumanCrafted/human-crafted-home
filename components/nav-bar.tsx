import Link from "next/link"
import { NavLink } from "@/components/nav-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight } from "lucide-react"
import { Logo } from "@/components/logo"

export function NavBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blur">
      <header className="flex justify-between items-center px-14 py-8">
        <Logo />
        <nav className="flex items-center gap-8">
          <NavLink href="/about" className="text-lg font-mono font-medium">
            About
          </NavLink>
          <ThemeToggle />
          <Link
            href="/lab"
            className="font-sans font-bold px-5 py-1 bg-foreground text-background hover:bg-accent hover:text-foreground transition-colors rounded-full text-[22px] flex items-center gap-2"
          >
            Let's co/lab
            <ArrowRight className="w-6 h-6" strokeWidth={3} />
          </Link>
        </nav>
      </header>
    </div>
  )
}

