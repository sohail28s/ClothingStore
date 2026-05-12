// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         "nav-dark": "#1C1A19", // Main text/icon color for light headers
//         "nav-light": "#FAFAFA", // Main text/icon color for dark headers
//         "brand-sale": "#8B0910", // The specific dark red used for "Sale" links
//         "nav-border": "#E5E7EB", // Standard gray for dropdown borders
//       },
//       fontFamily: {
//         // Now you can use 'font-central' for Questrial
//         central: ["Questrial", "sans-serif"],
//         // Now you can use 'font-ballinger' for Geist Mono
//         ballinger: ["Geist Mono", "monospace"],
//       },
//     },
//   },
// };




/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "nav-dark": "#1C1A19", // Main text/icon color for light headers
        "nav-light": "#FAFAFA", // Main text/icon color for dark headers
        "brand-sale": "#8B0910", // The specific dark red used for "Sale" links
        "nav-border": "#E5E7EB", // Standard gray for dropdown borders
      },
      fontFamily: {
        // Now you can use 'font-central' for Questrial
        central: ["Questrial", "sans-serif"],
        // Now you can use 'font-ballinger' for Geist Mono
        ballinger: ["Geist Mono", "monospace"],
      },
      // NEW: Added for the Footer Marquee animation
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // Translates half the width for a seamless loop
        }
      }
    },
  },
  plugins: [],
};