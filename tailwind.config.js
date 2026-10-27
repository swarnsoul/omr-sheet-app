/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '22': 'repeat(22, minmax(0, 1fr))',
      },
      colors: {
        omr: {
          magenta: "var(--omr-magenta, #E6007E)",
          header: "var(--omr-header-bg, #FBDCEB)",
          dark: "#111111",
          mark: "#000000",
        },
      },
    },
  },
  plugins: [],
}
