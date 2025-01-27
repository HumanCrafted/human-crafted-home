import "./globals.css"
import { Work_Sans, IBM_Plex_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-work-sans",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
})

export const metadata = {
  title: "Human Crafted",
  description: "A product design studio specializing in the rapid realization of ideas.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${workSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className={`bg-background text-foreground min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
