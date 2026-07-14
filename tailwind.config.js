/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
  colors: {
    primary: "#5B8CFF",     // stronger blue focus
    secondary: "#3F347E",   // rich violet
    accent: "#6DBE7B",      // meadow green
    base: "#0a0a2b",
    surface: "#F1F4F3",
    muted: "#9499A4"
  },

    },
  },
  plugins: [],
}

