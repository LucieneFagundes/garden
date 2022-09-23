/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          100: '#e1f9e8'
        },
      },
      screens: {
        'xs': {'max': '639px'}
      }
    },
  },
  plugins: [],
}
