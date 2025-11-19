import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // This sets Poppins as the default font-sans
                sans: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
                poppins: ['var(--font-poppins)', 'sans-serif'],
            },
            // ... rest of your theme config (colors, etc.)
        },
    },
    plugins: [],
};
export default config;