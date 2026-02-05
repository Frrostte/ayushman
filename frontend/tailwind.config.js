/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--background) / <alpha-value>)',
                foreground: 'rgb(var(--foreground) / <alpha-value>)',
                surface: 'rgb(var(--surface) / <alpha-value>)',
                primary: {
                    DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
                    dark: '#5b21b6', // Violet 800 - Consider variable if needed
                    light: '#a78bfa', // Violet 400
                    foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
                    glow: 'rgba(124, 58, 237, 0.5)'
                },
                secondary: '#a1a1aa',
                accent: '#c084fc',
                border: 'rgb(var(--border) / <alpha-value>)',
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
