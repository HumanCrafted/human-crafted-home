/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        accent: "hsl(var(--accent))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        white: "hsl(var(--white))",
        black: "hsl(var(--black))",
      },
      fontFamily: {
        sans: ["var(--font-work-sans)", "sans-serif"],
        // mono: ["input-mono-narrow","monospace"],
        mono: ["var(--font-ibm-plex-mono)","monospace"],
      },
    },
  },
  plugins: [],
}