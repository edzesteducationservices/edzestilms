module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens: {
      sm: '600px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      // example of a custom one
      '2xl': '1440px',
    },
    extend: {
      // other theme extensions
    },
  },
  plugins: [],
}
