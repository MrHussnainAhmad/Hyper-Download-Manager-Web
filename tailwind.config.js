/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066cc',
          dark: '#0052a3',
          light: '#e6f0ff',
        },
        success: {
          DEFAULT: '#10b981',
          dark: '#059669',
        },
      },
    },
  },
  plugins: [],
}