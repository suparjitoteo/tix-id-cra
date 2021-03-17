module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: "100%",
        md: "100%",
        lg: "1024px",
        xl: "1280px"
      }
    },
    minWidth: {
       '0': '0',
       '1/4': '25%',
       '1/3': '33%',
       '1/2': '50%',
       '3/4': '75%',
       'full': '100%',
    },
    extend: {},
  },
  variants: {
    extend: {
      margin: ['first'],
      backgroundColor: ['active'],
      opacity: ['disabled'],
    }
  },
  plugins: [],
}
