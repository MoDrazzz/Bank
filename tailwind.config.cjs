/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#222222",
        primary: "#4D9655",
        red: "#B64949",
        dimmed: "#DDDDDD",
        gray: "#AAAAAA",
      },
    },
  },
  plugins: [],
};
