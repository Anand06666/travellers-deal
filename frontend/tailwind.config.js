/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#ff5533', // GetYourGuide Red/Orange
                secondary: '#1a1a1a', // Dark Text/Background
                accent: '#00af87', // Teal/Green accent often used
                surface: '#ffffff',
                background: '#f5f5f5',
                'light-gray': '#dfdfdf',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
