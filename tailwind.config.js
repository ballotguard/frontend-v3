/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1b1938',
          deep: '#0e0c1f',
        },
        surface: {
          'violet-soft': '#c9b4fa',
          'teal-deep': '#0e3030',
          'teal-mid': '#155555',
        },
        canvas: {
          DEFAULT: '#ffffff',
          soft: '#fafaf8',
        },
        hairline: {
          DEFAULT: '#e8e4dd',
          dark: '#3f3a52',
        },
        ink: {
          DEFAULT: '#292827',
          mute: '#73706d',
          faint: '#9a9794',
        },
        'on-primary': '#ffffff',
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontWeight: {
        subnormal: '460',
        submedium: '540',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'char-up': {
          '0%': { transform: 'translateY(115%)', opacity: '0' },
          '100%': { transform: 'translateY(0%)', opacity: '1' },
        },
        'fade-down': {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'fade-down': 'fade-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
