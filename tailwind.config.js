/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: { DEFAULT: '#FF6A00', 50: '#FFF3E6', 100: '#FFE2BF', 200: '#FFC580', 300: '#FFA640', 400: '#FF8A1A', 500: '#FF6A00', 600: '#E55F00', 700: '#B34A00', 800: '#803500', 900: '#4D2000' },
        neon: { DEFAULT: '#8A2BE2', 50: '#F5EAFF', 100: '#E8D0FF', 200: '#D0A3FF', 300: '#B576FF', 400: '#9D4DFF', 500: '#8A2BE2', 600: '#7A1BC2', 700: '#6A0FA2', 800: '#5A0882', 900: '#4A0462' },
        ink: { DEFAULT: '#0A0A0F', 50: '#1A1A24', 100: '#15151E', 200: '#12121A', 300: '#0F0F16', 400: '#0C0C12', 500: '#0A0A0F', 600: '#08080C', 700: '#060609', 800: '#040406', 900: '#020203' },
      },
      fontFamily: { display: ['"Orbitron"', 'sans-serif'], sans: ['"Inter"', 'system-ui', 'sans-serif'] },
      spacing: { '18': '4.5rem', '22': '5.5rem', '88': '22rem' },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards', 'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-down': 'fadeDown 0.6s ease-out forwards', 'slide-in': 'slideIn 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite', 'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite', 'gradient-shift': 'gradientShift 8s ease infinite',
        'scan': 'scan 4s linear infinite', 'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeDown: { '0%': { opacity: '0', transform: 'translateY(-24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        glowPulse: { '0%, 100%': { boxShadow: '0 0 20px rgba(255,106,0,0.4), 0 0 40px rgba(138,43,226,0.2)' }, '50%': { boxShadow: '0 0 40px rgba(255,106,0,0.7), 0 0 80px rgba(138,43,226,0.5)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        gradientShift: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
