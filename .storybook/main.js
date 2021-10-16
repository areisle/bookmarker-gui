const path = require('path');
const toPath = (filePath) => path.join(process.cwd(), filePath);

const env = require('dotenv').config({
    path: path.resolve(__dirname, '../.env'),
}).parsed;

module.exports = {
    "stories": [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
        "@storybook/addon-links",
        "@storybook/addon-essentials"
    ],
    webpackFinal: async (config) => {
        const plugin = config.plugins.find(plugin => plugin.definitions && plugin.definitions['process.env']);
        // add my env vars
        Object.keys(env).forEach(key => {
            plugin.definitions['process.env'][key] = JSON.stringify(env[key]);
        });

        console.log(plugin.definitions['process.env'])

        return {
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                    '@emotion/core': toPath('node_modules/@emotion/react'),
                    'emotion-theming': toPath('node_modules/@emotion/react'),
                },
            },
        };
    },
}
