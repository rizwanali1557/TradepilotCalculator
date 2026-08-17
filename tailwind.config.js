/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tp: {
          /** Page / hero base (near-black navy) */
          base: '#0a0c10',
          /** Elevated panels */
          surface: '#12151c',
          elevated: '#161a22',
          /** Primary CTA / accents — hero button blue */
          primary: '#2563eb',
          'primary-hover': '#1d4ed8',
          'primary-light': '#3b82f6',
          /** Glow reference blues (for shadows) */
          glowBlue: '#102a5a',
          glowTeal: '#0d2b2d',
          /** Text on dark */
          ink: '#f8fafc',
          muted: '#94a3b8',
          nav: '#cbd5e1',
          border: 'rgba(148, 163, 184, 0.2)',
          /** Legacy keys used in Features / profit accents */
          'surface-tint': '#1e3a5f',
          success: '#2dd4bf',
          'success-light': '#5eead4',
          warning: '#f59e0b',
          danger: '#ef4444',
          'dark-1': '#12151c',
          'dark-2': '#0a0c10',
          'dark-3': '#161a22',
        },
      },
      backgroundImage: {
        'tp-primary': 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        'tp-primary-hover': 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
        'tp-success': 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)',
        'tp-hero':
          'linear-gradient(180deg, #0a0c10 0%, #0b1020 45%, #0a0c10 100%)',
        'tp-card': 'linear-gradient(180deg, #161a22 0%, #12151c 100%)',
        'tp-dark-card': 'linear-gradient(180deg, #12151c 0%, #0a0c10 100%)',
      },
      boxShadow: {
        'tp-glow': '0 0 32px rgba(37, 99, 235, 0.25)',
        'tp-glow-sm': '0 0 24px rgba(37, 99, 235, 0.15)',
        'tp-glow-success': '0 0 28px rgba(45, 212, 191, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        calcResult: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'calc-result': 'calcResult 0.45s ease-out both',
      },
    },
  },
  plugins: [],
}
