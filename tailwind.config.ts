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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FFA726",
          hover: "#FB8C00",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#42A5F5",
          hover: "#1E88E5",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#6A0DAD",
          light: "#8B5CF6",
          foreground: "#FFFFFF",
        },
        custom: {
          pink: "#FFC1E3",
          blue: "#C1EFFF",
          gold: "#FFD700",
        },
      },
      fontFamily: {
        pacifico: ["Pacifico", "cursive"],
        opensans: ["Open Sans", "sans-serif"],
      },
      keyframes: {
        "float-star": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        "float-star": "float-star 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;