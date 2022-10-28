/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      padding: {
        "4px": "4px"
      },
      minWidth: {
        "sm": "2rem"
      },
      borderRadius: {
        "s": "0.25rem"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["emerald"]
  },
}
