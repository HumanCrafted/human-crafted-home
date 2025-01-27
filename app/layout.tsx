import "./globals.css"
import type React from "react"
import { Work_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-work-sans",
})

const faviconVersion = Date.now()

export const metadata = {
  title: "Human Crafted",
  description: "A product design studio specializing in the rapid realization of ideas.",
  icons: {
    icon: [
      { url: `/favicon.ico?v=${faviconVersion}`, sizes: "any" },
      { url: `/icon.svg?v=${faviconVersion}`, type: "image/svg+xml" },
    ],
    apple: `/apple-touch-icon.png?v=${faviconVersion}`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${workSans.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/loe5zix.css" />
      </head>
      <body className={`bg-background text-foreground min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

