/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
const paddingPxRange = Array.from({ length: 601 }, (_, i) => i); // 0..600px
const paddingSafelistPrefixes = ["", "sm:", "md:", "lg:"];
const paddingSafelist = paddingPxRange.flatMap((px) =>
  paddingSafelistPrefixes.flatMap((prefix) => [
    `${prefix}pt-[${px}px]`,
    `${prefix}pb-[${px}px]`,
  ])
);

module.exports = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  safelist: [
    'bg-gradient-cta',
    'bg-gradient-cta-2',
    'bg-brand-gradient',
    ...paddingSafelist,
  ],
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
          star: '#FFCA2E',
        },
        footer: {
          bg: '#000000',
          bar: '#1C1F21',
        },
        form: {
          bg: '#F5F7FB',
          border: '#E1E6EF',
          text: '#1F2733',
          placeholder: '#8A94A6',
          focus: '#4A90E2',
          checkbox: '#C7D3E4',
          success: '#25D366',
          ring: 'rgba(74,144,226,0.18)',
        },
        table: {
          header: '#eeeef5',
          row: '#f5f6fb',
          border: '#e1e4eb',
          text: '#4f5459',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #FF5757 0%, #FF4CC9 47.12%, #EDD83F 100%)',
        'gradient-cta': 'linear-gradient(90deg, #ff5795 0%, #ff974c 100%)',
        'gradient-modal': 'linear-gradient(135deg, #FF4D8D 0%, #FF7B2F 100%)',
        'gradient-cta-2': 'linear-gradient(90deg, #FFAD81 0%, #A2B4FF 100%)',
        'logos-gradient': 'linear-gradient(90deg, #81BCFF 0%, #F4BFFF 100%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 170, 232, 0.3)',
        modal: '0 20px 48px rgba(0, 0, 0, 0.22)',
        cta: '0 8px 20px rgba(255, 103, 143, 0.35)',
        'modal-btn': '0 8px 24px rgba(255, 77, 141, 0.25)',
      },
      keyframes: {
        'text-fill-animation': {
          '0%, 100%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(360deg)' },
        },
      },
      animation: {
        'text-fill': 'text-fill-animation 8s infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
};
