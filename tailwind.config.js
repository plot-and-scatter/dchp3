/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: colors.red[600],
      "primary-lightest": colors.red[100],
      "primary-light": colors.red[400],
      "primary-dark": colors.red[700],
      red: colors.red,
      blue: colors.blue,
      green: colors.emerald,
      gray: colors.slate,
      alert: colors.amber,
      success: colors.emerald,
      white: colors.white,
      amber: colors.amber,
      action: colors.blue,
    },
    extend: {},
  },
  plugins: [],
}
