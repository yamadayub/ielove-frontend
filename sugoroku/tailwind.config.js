/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2a526b',
          light: '#6e8b9e',
          lighter: '#e5eaed',
          lightest: '#f5f7f8'
        }
      }
    },
  },
  plugins: [],
};