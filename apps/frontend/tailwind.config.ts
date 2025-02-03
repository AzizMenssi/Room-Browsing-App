import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1db954",
        background: "#121212",
        surface: "#212121",
        secondary: "#535353",
        text: "#b3b3b3",
      },
    },
  },
  plugins: [],
};
export default config;
