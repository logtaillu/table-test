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
    themes: [{
      extable: {
        "primary": "#377CFB",
        "primary-content": "#f9fafb",
        "secondary": "#66cc8a",
        "secondary-content": "#223D30",
        "accent": "#EA5234",
        "accent-content": "#f9fafb",
        "neutral": "#333C4D",
        "neutral-content": "#f9fafb",
        "base-100": "#FFFFFF",
        "info": "#3ABFF8",
        "success": "#36D399",
        "warning": "#FBBD23",
        "error": "#F87272",
      }
    }]
  },
}
