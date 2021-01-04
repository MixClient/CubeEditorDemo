const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

// App directory
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    //entry: path.resolve(appDirectory, "src/index.ts"),
    entry: path.resolve(appDirectory, "src/editor/Editor.ts"),
    output: {
        filename: 'js/cubeEditor.js',
        //library: 'CubeEditor',
        libraryTarget: "umd2",
        globalObject: "this",
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: 'source-map-loader',
            enforce: 'pre',
        },
        {
            test: /\.tsx?$/,
            loader: 'ts-loader'
        },
        {
            test: /\.(png|jpg|gif|env|glb|stl)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 81920,
                },
            },],
        }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { from: "public/cube", to: "cube" },
        //     ],
        // }),
        // new HtmlWebpackPlugin({
        //     inject: true,
        //     template: path.resolve(appDirectory, "public/index.html"),
        // }),
    ]
}