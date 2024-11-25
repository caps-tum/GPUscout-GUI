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
    safelist: [
        'grid-rows-1',
        'grid-rows-2',
        'grid-rows-3',
        'grid-rows-4',
        'grid-rows-5',
        'grid-rows-6',
        'grid-rows-7',
        'grid-rows-8',
        'row-span-1',
        'row-span-2',
        'row-span-3',
        'row-span-4',
        'row-span-5',
        'row-span-6',
        'row-span-7',
        'row-span-8'
    ],
    plugins: []
};
