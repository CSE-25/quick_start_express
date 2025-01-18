import { defineConfig } from "vitepress";

export default defineConfig({
    base: "/quick_start_express/", // Not to be changed as it's the /<repository-name>/ for deployment.
    title: "Quick Start Express",
    titleTemplate: ":title | QSE",
    description: "A CLI tool to generate Express.js server templates.",
    cleanUrls: true,

    themeConfig: {
        nav: [
            { text: "Home", link: "/" },
            { text: "Docs", link: "/getting-started" },
        ],
        search: {
            provider: "local",
            placeholder: "Search",
        },
        sidebar: [
            {
                text: "Docs",
                items: [
                    { text: "Getting Started", link: "/getting-started" },
                    { text: "Setup", link: "/setup" },
                ],
            },
        ],
        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/CSE-25/quick_start_express",
            },
            {
                icon: "npm",
                link: "https://www.npmjs.com/package/quick_start_express",
            },
        ],
    },
});
