/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}", // Catch-all for other folders like 'services' if they adhere to components
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#4ADE80",
                "background-light": "#FDFBF7",
                "background-dark": "#121212",
                "card-green": "#CFE9BC",
                "card-gray": "#F6F6F6",
                "card-blue": "#BBE8EE",
                "accent-pink": "#FF88BB",
                "accent-yellow": "#FFD54F",
                "accent-blue": "#4FC3F7",
                "accent-purple": "#B39DDB"
            },
            fontFamily: {
                display: ["'Plus Jakarta Sans'", "Montserrat", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
            borderRadius: {
                'DEFAULT': "24px",
                'xl': "32px",
                '2xl': "40px",
            },
            borderWidth: {
                '3': '3px',
            }
        },
    },
    plugins: [],
}
