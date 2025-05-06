const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        index: {
            import: './src/index.ts',
            dependOn: 'shared'
        },
        shared: 'pixi.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "template/index.html",
            title: "Zimad Test Project (Dev build)"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "assets", to: "assets" },
                { from: "template/css", to: "css" }
            ]
        }),
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].application.js',
        path: path.resolve(__dirname, 'dist'),
        devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
    },
    node: {
        global: true
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer")
        }
    }
};