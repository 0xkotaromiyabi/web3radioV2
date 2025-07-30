import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // Vintage radio colors
        wood: {
          light: "#D4A373",
          DEFAULT: "#A67C52",
          dark: "#8B5E34",
        },
        metal: {
          light: "#E5E5E5",
          DEFAULT: "#C0C0C0",
          dark: "#808080",
        },
        display: {
          DEFAULT: "#32CD32", // Retro LED green
          dim: "#1F7A1F",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
      },
      keyframes: {
        "led-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "dial-turn": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'text-clip': {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '50%': { clipPath: 'inset(0 0 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 100%)' }
        }
      },
      animation: {
        "led-glow": "led-glow 2s ease-in-out infinite",
        "dial-turn": "dial-turn 3s ease-in-out",
        "marquee": "marquee 20s linear infinite",
        "text-clip": "text-clip 15s linear infinite"
      },
      backgroundImage: {
        "wood-pattern": "url('/wood-texture.png')",
        "metal-texture": "url('/metal-texture.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;