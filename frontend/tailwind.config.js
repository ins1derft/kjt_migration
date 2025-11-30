/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', 'Open Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['var(--font-lorin)', 'Nunito', 'Open Sans', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          sky: '#00AAE8',
          dark: '#1A1A1A',
          gray: '#F4F5FA',
          orange: '#FF5722',
          start: '#FF5757',
          mid: '#FF4CC9',
          end: '#EDD83F',
          green: '#7CB342',
          gold: '#C5A365',
        },
        social: {
          facebook: '#1877F2',
          instagram: '#E4405F',
          linkedin: '#0A66C2',
          youtube: '#FF0000',
        },
        ui: {
          dot: '#D9D9D9',
          star: '#FFB400',
        },
        footer: {
          bg: '#000000',
          bar: '#1C1F21',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #FF5757 0%, #FF4CC9 47%, #EDD83F 100%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 170, 232, 0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
