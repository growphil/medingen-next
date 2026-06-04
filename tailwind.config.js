module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medingen: {
          primary: "#5D399B",
          secondary: "#8B5CF6",
          dark: "#1E1B4B",
          light: "#F5F3FF",
        }
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
      }
    },
  },
  plugins: [],
}
