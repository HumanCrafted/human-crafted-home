"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect to set mounted to true on client-side
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Render nothing on the server side
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-14 h-14 flex items-center justify-center text-foreground"
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" strokeWidth={2} />
      <Moon
        className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        strokeWidth={2}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

