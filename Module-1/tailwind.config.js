/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1552A6',
          dark: '#0e3b79',
          light: '#2373df',
        },
        secondary: {
          DEFAULT: '#28B6E8',
          dark: '#1c95c1',
          light: '#53c8f1',
        },
        accent: {
          DEFAULT: '#EC008C',
          dark: '#b8006a',
          light: '#ff3fa7',
        },
        brandDark: {
          DEFAULT: '#0f172a',
          card: '#1e293b',
          sidebar: '#0c0f18',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
