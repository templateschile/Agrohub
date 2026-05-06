/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agro-green': {
          50: '#f0f7ee',
          100: '#dcefd8',
          200: '#b9dfb1',
          300: '#8dc882',
          400: '#5fad53',
          500: '#3d9132',
          600: '#2d7325',
          700: '#245b1e',
          800: '#1e481a',
          900: '#183c15',
        },
        'agro-earth': {
          50: '#faf6f0',
          100: '#f2e9d8',
          200: '#e5d0ac',
          300: '#d4b27a',
          400: '#c49454',
          500: '#b67d3a',
          600: '#9a6530',
          700: '#7d4f27',
          800: '#653f22',
          900: '#52331c',
        },
        'agro-blue': {
          50: '#eff7ff',
          100: '#dbeffe',
          200: '#bfe0fd',
          300: '#93cbfb',
          400: '#60adf7',
          500: '#3b8ef3',
          600: '#2570e8',
          700: '#1d5bd5',
          800: '#1e4aac',
          900: '#1e3f88',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
