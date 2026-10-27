/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        volt: {
          cyan: '#00f2fe',
          teal: '#4facfe',
          green: '#10b981',
          emerald: '#059669',
          amber: '#f59e0b',
          crimson: '#ef4444',
          dark: '#080c14',
          card: '#0f172a',
          border: '#1e293b'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
