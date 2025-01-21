import "./globals.css"
import { Inter, Work_Sans, IBM_Plex_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
})

export const metadata = {
  title: "Human Crafted",
  description: "A product design studio specializing in the rapid realization of ideas.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${workSans.variable} ${ibmPlexMono.variable}`}>
      <body
        className={`${inter.className} ${workSans.className} bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

