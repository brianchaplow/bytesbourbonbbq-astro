/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1400px',
      },
      colors: {
        bbq: {
          400: '#A85000',
          500: '#8B4000',
          600: '#6B2D00',
        },
        sauce: {
          400: '#E04D2A',
          500: '#C73E1D',
          600: '#A73218',
        },
        smoke: {
          400: '#5A5A5A',
          500: '#4A4A4A',
          600: '#333333',
        },
        fire: {
          400: '#FF8533',
          500: '#F66911',
          600: '#D45500',
        },
        cyber: {
          400: '#5BC4D4',
          500: '#4BA7B9',
          600: '#3A8A9A',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 10px 25px -10px rgba(0,0,0,.4)',
        glow: '0 0 20px rgba(246, 105, 17, 0.3)',
      },
      animation: {
        herofade: 'herofade 3s ease-out forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        herofade: {
          '0%': { opacity: '0', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(246, 105, 17, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(246, 105, 17, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
