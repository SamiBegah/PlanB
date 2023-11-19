/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 3s linear infinite",
      },
      backgroundImage: {
        "lead-img": "url('/src/media/leadImage.jpg')",
        "jobs-img": "url('/src/media/jobsImage.jpg')",
        "employer-img": "url('/src/media/employerBg.jpg')",
        "reviews-img": "url('/src/media/reviewsBg.jpg')",
        "contact-img": "url('/src/media/contactImage.jpg')",
        "map-img": "url('/src/media/map.png')",
      },
    },
  },
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("flowbite/plugin"),
  ],
};
