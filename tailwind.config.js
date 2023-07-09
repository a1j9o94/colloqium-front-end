/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'gradient-start': 'rgb(255, 255, 255)',
        'gradient-end': 'rgb(142.03, 234.07, 236.73)',
      },
      spacing: {
        '78.7': '78.7px',
        // add more custom spacing here
      },
      fontSize: {
        'xs': '14px',
        's': '18px',
        'm': '90px',
        'l': '110px',
      },
      fontFamily: {
        'inter': ['Inter'],
        'poppins': ['Poppins'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['cupcake', 'dark'],
  },
}