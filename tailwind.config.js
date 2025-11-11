// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./components/**/*.{js,vue}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.js",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        brand:{
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb',
        }
      },
    },
  },
  plugins: [],
}