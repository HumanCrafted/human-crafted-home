/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
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
        mono: ["var(--font-ibm-plex-mono)","monospace"],
      },
    },
  },
  plugins: [],
}

