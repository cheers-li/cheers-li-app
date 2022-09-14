/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        half: '50%',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
