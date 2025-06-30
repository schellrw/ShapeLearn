/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Child-friendly color palette
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Math shape colors
        shape: {
          red: '#FF6B6B',
          teal: '#4ECDC4',
          blue: '#45B7D1',
          green: '#96CEB4',
          yellow: '#FECA57',
          pink: '#FF9FF3',
          purple: '#5F27CD',
          cyan: '#00D2D3',
        }
      },
      fontSize: {
        // Large touch-friendly sizes
        'touch-sm': ['18px', '24px'],
        'touch-base': ['20px', '28px'],
        'touch-lg': ['24px', '32px'],
        'touch-xl': ['28px', '36px'],
        'touch-2xl': ['32px', '40px'],
      },
      spacing: {
        // Touch-friendly spacing (minimum 44px for touch targets)
        'touch': '44px',
        'touch-lg': '56px',
        'touch-xl': '72px',
      }
    },
  },
  plugins: [],
} 