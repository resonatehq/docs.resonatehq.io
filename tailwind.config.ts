import type { Config } from "tailwindcss";
import resonatePreset from "./resonate-preset";

const config: Config = {
  ...resonatePreset,
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
};

export default config;
