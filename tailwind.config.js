/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/renderer/index.html', './src/renderer/src/**/*.{vue,js}', './src/config/*.js'],
    theme: {
        extend: {
            colors: {
                text: '#050316',
                background: '#fbfbfe',
                primary: '#4b33dd',
                secondary: '#968ee0',
                accent: '#6a5de4'
            }
        }
    },

    plugins: []
};
