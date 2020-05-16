const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const workboxPlugin = require('workbox-webpack-plugin')

module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new workboxPlugin.GenerateSW({
            swDest: 'sw.js',
            runtimeCaching: [{
                urlPattern: new RegExp('^https?:\/\/[a-zA-Z0-9-]+.[a-zA-Z0-9-]+.?[a-zA-Z0-9-]*[\/*[a-zA-Z0-9-]*\/*]*$'),
                handler: 'StaleWhileRevalidate'
            }]
        })
    ]
}
