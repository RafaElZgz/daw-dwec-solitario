// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: 'Solitario',
            link: [
                {
                    rel: 'icon',
                    type: 'image/png',
                    href: '/logo.png',
                },
            ],
        },
    },
    modules: ['@nuxtjs/tailwindcss'],
    srcDir: 'src',
});
