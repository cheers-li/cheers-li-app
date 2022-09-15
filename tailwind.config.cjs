/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'dark-gradient':
          'linear-gradient(33.92deg, #0C4A6E -4.09%, #0284C7 114.96%);',
      },
      maxWidth: {
        half: '50%',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
