const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const widgetConfig = {
    entry: {
        GoogleMaps: "./src/GoogleMaps/components/GoogleMapContainer.ts",
        GoogleMapsContext: "./src/GoogleMaps/components/GoogleMapContext.ts",
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
            }) }
        ]
    },
    devtool: "source-map",
    externals: [ "mendix/lang", "react", "react-dom" ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.xml" },
        ], { copyUnmodified: true }),
        new ExtractTextPlugin({ filename: "./src/com/mendix/widget/custom/GoogleMaps/ui/[name].css" }),
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

const previewConfig = {
    entry: "./src/GoogleMaps/GoogleMaps.webmodeler.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/GoogleMaps/GoogleMaps.webmodeler.js",
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [ ".ts", ".js" ],
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, loader: "raw-loader" }
        ]
    },
    devtool: "inline-source-map",
    externals: [ "react", "react-dom" ],
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

const previewContextConfig = {
    entry: "./src/GoogleMaps/GoogleMaps.webmodeler.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/GoogleMaps/GoogleMapsContext.webmodeler.js",
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [ ".ts", ".js" ],
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, loader: "raw-loader" }
        ]
    },
    devtool: "inline-source-map",
    externals: [ "react", "react-dom" ],
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

module.exports = [ widgetConfig, previewConfig, previewContextConfig ];
