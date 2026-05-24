/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        secondary: "#6b5b4a",
        accent: "#c97e4a",
        surface: "#6b5b4a",
      },
      fontFamily: {
        heading: ["Bebas Neue", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
