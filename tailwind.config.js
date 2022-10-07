/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          100: '#e1f9e8',
          200: '#16a34a',
        },
      },
      screens: {
        'xs': {'max': '640px'}
      }
    },
  },
  plugins: [],
}
