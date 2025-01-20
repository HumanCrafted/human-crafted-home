import Link from 'next/link'
import { Instagram, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto w-full px-[60px] py-12 md:flex md:items-center md:justify-between lg:px-[60px]">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="#" className="text-foreground hover:text-accent">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" strokeWidth={2} />
          </Link>
          <Link href="#" className="text-foreground hover:text-accent">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" strokeWidth={2} />
          </Link>
          <Link href="#" className="text-foreground hover:text-accent">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" strokeWidth={2} />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center font-mono text-sm leading-5 text-foreground">
            &copy; 2025 Human Crafted LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

