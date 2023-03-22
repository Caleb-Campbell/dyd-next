/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D7D6D6",
        secondary: "#C2C1C1",
        text: "#5D5E60"
      }
    },
  },
  plugins: [],
};

module.exports = config;
