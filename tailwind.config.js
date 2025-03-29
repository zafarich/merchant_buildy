/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5671F9',
        f1f2f4: '#f1f2f4',
      },
      borderRadius: {
        10: '10px',
        20: '20px',
      },

      screens: {
        768: '768px',
      },
    },
  },
  plugins: [],
}
