/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        background_wedding:
          "url('../public/assets/After-Dark-Wedding-Photography-John-Malloy-Photography_0002.jpg')",
        background_register: "url('../public/assets/register_background.jpg')",
        background_dashboard: "url('../public/assets/cust_dashboard.webp')",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("rippleui"),
  ],
  variants: {
    textColor: ["responsive", "hover", "focus", "group-hover"],
  },
};
