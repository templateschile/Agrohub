/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Verde de la app (app-mobile/lib/theme/ah_tokens.dart): papel, menta y bosque, para que
        // las páginas antiguas usen el mismo verde que la portada
        'agro-green': {
          50: '#EAF6EC',
          100: '#DCEFE0',
          200: '#C9F7DD',
          300: '#6EE7A8',
          400: '#34B577',
          500: '#1F8A4E',
          600: '#17663C',
          700: '#11512F',
          800: '#0B3B24',
          900: '#062716',
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
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
    },
  },
  // .container es el del sistema del sitio (src/base.css): ancho tope 1440px y márgenes propios
  corePlugins: { container: false },
  plugins: [],
}
