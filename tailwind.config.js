/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F5F7",
        ink: "#1D1D1F",
        subtle: "#6E6E73",
        accent: {
          DEFAULT: "#0071E3",
          dark: "#0058B0",
          light: "#E8F2FD",
        },
        alert: {
          DEFAULT: "#FF3B30",
          light: "#FFEBEA",
        },
        success: {
          DEFAULT: "#34C759",
          light: "#E9F9EE",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "var(--font-noto-sans-jp)",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}
