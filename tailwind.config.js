/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A1128',
        'stonks-green': '#3FBF3F',
        white: '#FFFFFF',
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #3FBF3F, 0 0 10px #3FBF3F, 0 0 15px #3FBF3F' },
          '100%': { boxShadow: '0 0 10px #3FBF3F, 0 0 20px #3FBF3F, 0 0 30px #3FBF3F' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 