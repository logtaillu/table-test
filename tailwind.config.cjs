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
      textColor: {
        "normal": "#666"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      basetable: {
        ...require("daisyui/src/colors/themes")["[data-theme=emerald]"],
        secondary: "#66cc8a",
        "secondary-content": "#223D30",
        primary: "#377cfb",
        "primary-content": "#f9fafb",
      },
      toolbar: {
        "neutral": "#fff"
      }
    }]
  },
}
