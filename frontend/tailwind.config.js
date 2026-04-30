/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#EAF9E7',
          DEFAULT: '#2A4239',
          dark: '#013237',
        }
      }
    },
  },
  plugins: [],
}
