import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                // This sets Poppins as the default font-sans
                sans: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
            },
            // ... rest of your theme config (colors, etc.)
        },
    },
    // plugins: [require("tailwindcss-animate")],
}