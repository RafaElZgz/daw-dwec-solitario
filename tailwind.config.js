/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,vue,ts}', './node_modules/flowbite.{js,ts}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fef7ee',
                    100: '#feecd6',
                    200: '#fbd5ad',
                    300: '#f8b779',
                    400: '#f48f43',
                    500: '#f16f1e',
                    600: '#e45614',
                    700: '#bc4012',
                    800: '#953317',
                    900: '#782d16',
                },
            },
        },
    },
    plugins: [require('flowbite')],
};
