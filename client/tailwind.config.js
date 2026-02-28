/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#050810',
          secondary: '#080d1a',
          surface: '#0d1424',
          surface2: '#111b2e',
        },
        accent: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
        },
        'cyan-brand': '#22d3ee',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        border: {
          DEFAULT: 'rgba(99,179,237,0.12)',
          bright: 'rgba(99,179,237,0.35)',
        },
        text: {
          DEFAULT: '#e2e8f0',
          muted: '#94a3b8',
          faint: '#475569',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'accent':    '0 0 40px rgba(59,130,246,0.2)',
        'accent-lg': '0 0 80px rgba(59,130,246,0.35)',
        'green':     '0 0 30px rgba(16,185,129,0.2)',
      },
    },
  },
  plugins: [],
}