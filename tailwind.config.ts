import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        shareTechMono: ['"Share Tech Mono"', "monospace"],
      },
      colors: {
        primary: "#181C14",
        secondary: "#3C3D37",
        primHighlight: "#697565",
        secHighlight: "#ECDFCC",
      },
    },
  },
  plugins: [],
};
export default config;
