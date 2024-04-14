/** @type {import('tailwindcss').Config} */
export default {
  content: ['**/*.vue', 'app.vue'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat'],
      },
    },
  },
  plugins: [require('daisyui')],
}
