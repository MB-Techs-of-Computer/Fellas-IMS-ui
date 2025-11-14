/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#841815',
        secondary: '#3a5e38',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};