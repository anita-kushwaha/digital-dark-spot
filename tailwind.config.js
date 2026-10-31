/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkspot: {
          gap: '#c084fc',
          conflict: '#fb7185',
          outdated: '#fbbf24',
          fact: '#34d399',
          action: '#38bdf8'
        }
      }
    },
  },
  plugins: [],
}
