/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-high": "#272a32",
        "surface-container-highest": "#232730",
        "surface-container-lowest": "#14171f",
        "on-surface-variant": "#d0c5af",
        "primary": "#f2ca50",
        "primary-fixed-dim": "#d8bc79",
        "surface-container": "#1d1f27",
        "on-primary": "#3c2f00",
        "background": "#10131a",
        "on-surface": "#e1e2ec",
        "primary-container": "#d4af37",
        "surface-container-low": "#191b23",
        "surface-variant": "#32353d",
        "outline-variant": "#4d4635",
        "secondary-container": "#544519"
      },
      fontFamily: {
        "headline": ["Manrope"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "gradient-shift": "gradientShift 3s ease infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        gradientShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(242,202,80,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(242,202,80,0.8)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
