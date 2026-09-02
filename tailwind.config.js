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
      // For the Superadmin badge. Nothing else in the palette was free: red
      // means blocked in the neighbouring column and green means can log in.
      purple: colors.purple,
      success: colors.emerald,
      white: colors.white,
      amber: colors.amber,
      action: colors.blue,
    },
    extend: {
      fontFamily: {
        // The interface face. The site sets "Charter", "Georgia", serif on
        // html and body, which is right for dictionary text and wrong for
        // small labels, table headings and form controls. Applied to the admin
        // area as a whole rather than per component; see .admin-ui in
        // app/styles/additional.css, which puts headings back to the serif.
        //
        // Tailwind's own stack, so nothing is loaded over the network and
        // there is no flash of unstyled text.
        ui: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}
