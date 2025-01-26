import Link from 'next/link'
import { Instagram, Twitter, Linkedin, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto w-full px-[5%] py-12 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="https://www.instagram.com/human_crafted/" className="text-foreground hover:text-accent" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-5 w-5" strokeWidth={2} />
          </Link>
          <Link href="https://x.com/jonalling" className="text-foreground hover:text-accent" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-5 w-5" strokeWidth={2} />
          </Link>
          <Link href="https://www.linkedin.com/in/alling/" className="text-foreground hover:text-accent" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-5 w-5" strokeWidth={2} />
          </Link>
          <Link href="https://github.com/HumanCrafted" className="text-foreground hover:text-accent" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">Github</span>
            <Github className="h-5 w-5" strokeWidth={2} />
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

