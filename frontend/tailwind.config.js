/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0a', // Deep black
                surface: '#121212', // Slightly lighter for cards
                primary: {
                    DEFAULT: '#7c3aed', // Violet 600
                    dark: '#5b21b6', // Violet 800
                    light: '#a78bfa', // Violet 400
                    glow: 'rgba(124, 58, 237, 0.5)' // For glow effects
                },
                secondary: '#a1a1aa', // Zinc 400
                accent: '#c084fc', // Purple 400
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'purple-glow': 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, rgba(10, 10, 10, 0) 70%)',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
