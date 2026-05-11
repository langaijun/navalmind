/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        naval: {
          bg: {
            primary: '#0A0A0A',
            secondary: '#111111',
            elevated: '#1A1A1A',
          },
          text: {
            primary: '#F5F5F0',
            secondary: '#8A8A85',
            muted: '#555550',
          },
          accent: '#C4A55A',
          'accent-dim': '#8B7A3D',
          border: '#2A2A28',
          success: '#6B8F5E',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        'display': ['80px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '300' }],
        'h1': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '400' }],
        'h2': ['32px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '400' }],
        'h3': ['24px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['20px', { lineHeight: '1.7', letterSpacing: '0.01em', fontWeight: '300' }],
        'body': ['16px', { lineHeight: '1.8', letterSpacing: '0.01em', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.5', letterSpacing: '0.04em', fontWeight: '400' }],
        'small': ['11px', { lineHeight: '1.4', letterSpacing: '0.06em', fontWeight: '500' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '32px',
        'xl': '64px',
        '2xl': '120px',
        '3xl': '200px',
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        'full': '9999px',
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'elevated': '0 8px 32px rgba(0,0,0,0.4)',
        'glow': '0 0 40px rgba(196,165,90,0.08)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "scroll-line": {
          "0%": { height: "0", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { height: "40px", opacity: "0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "scroll-line": "scroll-line 2s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
