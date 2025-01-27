import Link from "next/link"
import { NavLink } from "@/components/nav-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight } from "lucide-react"
import { Logo } from "@/components/logo"

export function NavBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blur px-[5%] py-8" role="navigation">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Logo />
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <Link
              href="/lab"
              className="font-sans font-bold px-5 py-1 bg-foreground text-background hover:bg-accent hover:text-foreground transition-colors rounded-full text-[22px] flex items-center gap-2"
            >
              Let's co/lab
              <ArrowRight className="w-6 h-6" strokeWidth={3} />
            </Link>
          </div>
        </div>
        <nav className="flex flex-col items-start mt-8 space-y-8 md:flex-row md:items-center md:mt-0 md:space-y-0 md:space-x-8">
          <NavLink href="/about" className="text-lg font-mono">
            About
          </NavLink>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <ThemeToggle />
            <Link
              href="/lab"
              className="font-sans font-bold px-5 py-1 bg-foreground text-background hover:bg-accent hover:text-foreground transition-colors rounded-full text-[22px] flex items-center gap-2"
            >
              Let's co/lab
              <ArrowRight className="w-6 h-6" strokeWidth={3} />
            </Link>
          </div>
        </nav>
      </header>
    </div>
  )
}

