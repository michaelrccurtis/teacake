const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const UnminifiedWebpackPlugin = require("unminified-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        index: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: "[name].js",
        libraryTarget: "umd",
        library: "teacake",
        umdNamedDefine: true,
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    configFile: "tsconfig.build.json",
                },
            },
        ],
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin()],
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [new UnminifiedWebpackPlugin()],
};
