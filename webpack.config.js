var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/com/mendix/widget/google-maps/GoogleMaps.ts",
    output: {
        path: __dirname + "/dist/tmp",
        filename: "src/com/mendix/widget/google-maps/GoogleMaps.js",
        libraryTarget:  "umd",
        umdNamedDefine: true,
        library: "com.mendix.widget.google-maps.GoogleMaps"
    },
    resolve: {
        extensions: [ "", ".ts", ".tsx", ".js", ".json" ]
    },
    errorDetails: true,
    module: {
        loaders: [
            { test: /\.tsx?$/, loaders: [ "ts-loader" ] },
            { test: /\.json$/, loader: "json" }
        ]
    },
    devtool: "source-map",
    externals: [ "mxui/widget/_WidgetBase", "dojo/_base/declare" ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" },
            { from: "src/**/*.css" },

        ], {
            copyUnmodified: true
        })
    ],
    watch: true
};
