const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

const htmlTemplate = ({ htmlWebpackPlugin }) => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <script type="application/javascript" src="browser-polyfill.js"></script>
        <meta charset="UTF-8" />
        <title>${htmlWebpackPlugin.options.title}</title>
      </head>
      <body>
        <div id='root'></div>
      </body>
    </html>
    `
}

const htmlIndex = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>bookmarker</title>
  </head>
  <body>
    <a href="options.html">options</a>
    <a href="popup.html">popup</a>
  </body>
</html>
`

module.exports = {
    entry: {
        options: './src/Options.tsx',
        popup: './src/Popup.tsx',
        background: './src/background.ts',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'options.html',
            chunks: ['options'],
            title: 'Drama options',
            templateContent: htmlTemplate,
        }),
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            chunks: ['popup'],
            title: 'Drama popup',
            templateContent: htmlTemplate,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: [],
            templateContent: htmlIndex,
        }),
        new CopyPlugin({
            patterns: [
                { from: "public" },
                {
                    from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
                }
            ],
        }),
        new Dotenv(),
        new webpack.BannerPlugin({
            banner: 'window = typeof window !== "undefined" && window !== null ? window : self;',
            entryOnly: true,
            raw: true,
            include: ['background']
        }),
    ],
}
