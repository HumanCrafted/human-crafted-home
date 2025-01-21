"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function NavLink({ href, children, className = "" }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`relative ${className} group`}>
      <span className="relative z-10">{children}</span>
      <span
        className={`
          absolute left-[-8%] bottom-0 w-[116%] h-[25%] top-[40%] bg-accent mix-blend-darken dark:mix-blend-lighten
          transform origin-left scale-x-0 transition-transform duration-300 ease-out
          ${isActive ? "scale-x-100" : "group-hover:scale-x-100"}
        `}
      />
    </Link>
  )
}

