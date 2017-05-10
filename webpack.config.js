const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const widgetConfig = {
    entry: {
        GoogleMaps: "./src/components/GoogleMapContainer.ts",
        GoogleMapsContext: "./src/components/GoogleMapContext.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/com/mendix/widget/custom/GoogleMaps/[name].js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [ ".ts", ".js" ],
        alias: {
            "react-google-maps": path.resolve(__dirname, "./node_modules/react-google-maps"),
            "tests": path.resolve(__dirname, "./tests")
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            }) },
            { test: /\.(png|jpeg)$/, loader: "url-loader", options: { limit: 8192 } }
        ]
    },
    devtool: "source-map",
    externals: [ "mendix/lang", "react", "react-dom" ],
    plugins: [
        new CleanWebpackPlugin("dist/tmp"),
        new CopyWebpackPlugin([
            { from: "src/**/*.xml", copyUnmodified:true },
            { from: "src/**/*.png" }
        ], { copyUnmodified: true }),
        new ExtractTextPlugin({ filename: "./src/com/mendix/widget/custom/GoogleMaps/ui/[name].css" }),
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

const googleMapsConfig = {
    entry: "./src/GoogleMaps.webmodeler.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/GoogleMaps.webmodeler.js",
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [ ".ts", ".js" ]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, loader: "raw-loader" },
            { test: /\.(png|jpeg)$/, loader: "url-loader", options: { limit: 8192 } }
        ]
    },
    devtool: "inline-source-map",
    externals: [ "react", "react-dom" ],
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

const googleMapsContextConfig = {
    entry: "./src/GoogleMaps.webmodeler.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/GoogleMapsContext.webmodeler.js",
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [ ".ts", ".js" ]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, loader: "raw-loader" },
            { test: /\.(png|jpeg)$/, loader: "url-loader", options: { limit: 8192 } }
        ]
    },
    devtool: "inline-source-map",
    externals: [ "react", "react-dom" ],
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

module.exports = [ widgetConfig, googleMapsConfig, googleMapsContextConfig ];
