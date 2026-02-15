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
        // NexusAI Theme-Aware Color Palette (auto-switches via CSS vars)
        nexus: {
          // Backgrounds
          bg: 'var(--nexus-bg)',
          'surface-1': 'var(--nexus-surface-1)',
          'surface-2': 'var(--nexus-surface-2)',
          // Accents
          purple: 'var(--nexus-purple)',
          pink: 'var(--nexus-pink)',
          blue: 'var(--nexus-blue)',
          cyan: 'var(--nexus-cyan)',
          // Text
          text: 'var(--nexus-text)',
          'text-secondary': 'var(--nexus-text-secondary)',
          'text-muted': 'var(--nexus-text-muted)',
          // Border
          border: 'var(--nexus-border)',
          // Glass
          glass: 'var(--nexus-glass-bg)',
          'glass-border': 'var(--nexus-glass-border)',
        },
      },
      borderColor: {
        DEFAULT: 'var(--nexus-border)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        // Gradients - using CSS vars for theme awareness
        'nexus-gradient': 'linear-gradient(90deg, var(--nexus-purple), var(--nexus-pink))',
        'nexus-gradient-multi': 'linear-gradient(var(--nexus-purple), var(--nexus-blue), var(--nexus-pink))',
        'nexus-gradient-cyan': 'linear-gradient(var(--nexus-cyan), var(--nexus-purple))',
        'nexus-bg': 'linear-gradient(to bottom right, var(--nexus-surface-1), var(--nexus-bg), var(--nexus-surface-2))',
        // Grid pattern
        'nexus-grid': 'linear-gradient(var(--nexus-purple-03) 1px, transparent 1px), linear-gradient(90deg, var(--nexus-purple-03) 1px, transparent 1px)',
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
        'glow-purple': '0 0 40px var(--nexus-purple-40), 0 0 80px var(--nexus-purple-20)',
        'glow-pink': '0 0 30px var(--nexus-pink-50), 0 0 60px var(--nexus-pink-30)',
        'glow-cyan': '0 0 20px var(--nexus-cyan-60)',
        'glow-blue': '0 0 15px var(--nexus-blue-60)',
        'btn-primary': '0 0 20px var(--nexus-pink-40), inset 0 0 20px var(--nexus-pink-10)',
        'btn-primary-hover': '0 0 30px var(--nexus-pink-60), inset 0 0 30px var(--nexus-pink-20)',
      },
    },
  },
  plugins: [],
};

export default config;
