import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NexusAI Strict Color Palette
        nexus: {
          // Backgrounds
          black: '#000000',
          'dark-1': '#0B0B12',
          'dark-2': '#111118',
          // Accents
          purple: '#7B61FF',
          pink: '#FF4FD8',
          blue: '#5B8CFF',
          cyan: '#6EF3FF',
          // Text
          white: '#FFFFFF',
          'text-secondary': '#B5B5C3',
          'text-muted': '#8A8A9E',
        },
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        // Gradients - strictly from palette
        'nexus-gradient': 'linear-gradient(90deg, #7B61FF, #FF4FD8)',
        'nexus-gradient-multi': 'linear-gradient(#7B61FF, #5B8CFF, #FF4FD8)',
        'nexus-gradient-cyan': 'linear-gradient(#6EF3FF, #7B61FF)',
        'nexus-bg': 'linear-gradient(to bottom right, #0B0B12, #000000, #111118)',
        // Grid pattern
        'nexus-grid': 'linear-gradient(rgba(123, 97, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 97, 255, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'rotate': 'rotate 20s linear infinite',
        'rotate-reverse': 'rotate-reverse 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(20px, -20px) scale(1.05)' },
          '50%': { transform: 'translate(-10px, 20px) scale(0.95)' },
          '75%': { transform: 'translate(-20px, -10px) scale(1.02)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        rotate: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'rotate-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
      },
      boxShadow: {
        'glow-purple': '0 0 40px rgba(123, 97, 255, 0.4), 0 0 80px rgba(123, 97, 255, 0.2)',
        'glow-pink': '0 0 30px rgba(255, 79, 216, 0.5), 0 0 60px rgba(255, 79, 216, 0.3)',
        'glow-cyan': '0 0 20px rgba(110, 243, 255, 0.6)',
        'glow-blue': '0 0 15px rgba(91, 140, 255, 0.6)',
        'btn-primary': '0 0 20px rgba(255, 79, 216, 0.4), inset 0 0 20px rgba(255, 79, 216, 0.1)',
        'btn-primary-hover': '0 0 30px rgba(255, 79, 216, 0.6), inset 0 0 30px rgba(255, 79, 216, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
