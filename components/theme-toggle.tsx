"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect to set mounted to true on client-side
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Render nothing on the server side
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="w-14 h-14 flex items-center justify-center text-foreground relative"
    >
      <Sun
        className={`h-6 w-6 transition-all ${currentTheme === "dark" ? "scale-0 -rotate-90" : "scale-100 rotate-0"}`}
        strokeWidth={2}
      />
      <Moon
        className={`absolute h-6 w-6 transition-all ${currentTheme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"}`}
        strokeWidth={2}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

