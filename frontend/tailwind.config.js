/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light bluish and purplish theme
        'bluish': {
          50: '#f0f7ff',
          100: '#e0eeff',
          200: '#c0ddff',
          300: '#90c2ff',
          400: '#60a0ff',
          500: '#3070f0',
          600: '#2050d0',
          700: '#1535b0',
          800: '#0f2580',
          900: '#0a1a60',
        },
        'purplish': {
          50: '#fdf0ff',
          100: '#f8e0ff',
          200: '#f0c0ff',
          300: '#e090ff',
          400: '#c860e0',
          500: '#a840c0',
          600: '#8830a0',
          700: '#682080',
          800: '#481560',
          900: '#300f40',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}