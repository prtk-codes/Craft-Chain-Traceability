/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16F98A',
        secondary: '#0BD97D',
        dark: '#356747ff',
        'deep-dark': '#24462aff',
        accent: '#134338',
        'teal-dark': '#13433B',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif', 'Inter', 'system-ui'],
      },
    },
  },
  plugins: [],
}