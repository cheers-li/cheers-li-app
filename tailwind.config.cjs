/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'dark-gradient':
          'linear-gradient(33.92deg, #0C4A6E -4.09%, #0284C7 114.96%);',
      },
      maxWidth: {
        half: '50%',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  safelist: [
    {
      pattern: /^w-*/,
    },
    {
      pattern: /^h-*/,
    },
  ],
  plugins: [require('@tailwindcss/forms')],
};
