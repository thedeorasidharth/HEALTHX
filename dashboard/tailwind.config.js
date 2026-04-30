/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#c0e6ba',
          DEFAULT: '#013237',
          dark: '#001a1c',
        }
      }
    },
  },
  plugins: [],
}
