//tailwind.config.js
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#f0fdfd",
                    100: "#e0fafa",
                    50: "#f0fdfd",
                    100: "#e0fafa",
                    500: "#b8f0f1",
                    300: "#80e0e2",
                    400: "#4dd0d2",
                    500: "#33b8b9",
                    600: "#2a9a9b",
                    700: "#237b7c",
                    800: "#1e6263",
                    900: "#195051",
                    950: "#0f3334",
                },
                cprimary: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                cteal: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                }
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1)',
                'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1)',
                'modal': '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.05)',
            },
            animation: {
                'spin': 'spin 1s linear infinite'
            }
        }
    },
    safelist: [
        "opacity-30",
        "bg-gray-200",
        "text-gray-700",
        "hover:bg-gray-300",
        "text-red-500",
        "text-green-500",
        "text-blue-500",
        "text-yellow-500",
        "text-orange-500",
        "text-white",
        "border-2",

        "text-blue-700",
        "bg-blue-100",
        "bg-blue-500",
        "border-blue-500",
        "text-red-700",
        "bg-red-100",
        "bg-red-500",
        "border-red-500",
        "text-green-700",
        "bg-green-100",
        "bg-green-500",
        "border-green-500",
        "text-yellow-700",
        "bg-yellow-100",
        "bg-yellow-500",
        "border-yellow-500",

        "bg-orange-100",
        "bg-orange-500",
        "text-orange-700",
        "border-orange-500",
        "text-red-500",
    ],
    plugins: [],
}
