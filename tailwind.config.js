/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    gradientColorStops: theme => ({
      ...theme('colors'),
      primary: '#3490dc',
      secondary: '#ffed4a',
      danger: '#e3342f',
      pink: '#d53369',
      yellow: '#daae51',
    }),
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