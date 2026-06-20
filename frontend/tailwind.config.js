/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F6F2EB',   // off-white base
        ink: '#3D3226',     // primary text, warm dark brown
        clay: '#B5694A',    // primary accent
        moss: '#6B7857',    // secondary accent
        sand: '#E4D9C5',    // borders, dividers, muted backgrounds
      },
      fontFamily: {
        serif: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
