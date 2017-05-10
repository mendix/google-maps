"use strict";
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const webpackConfigRelease = [ {}, {} ];
const pluginsWidget = webpackConfig[0].plugins.slice(0);
pluginsWidget.push(new webpack.optimize.UglifyJsPlugin());
Object.assign(webpackConfigRelease[0], webpackConfig[0], {
    devtool: false,
    plugins: pluginsWidget
});
const pluginsPreview = webpackConfig[1].plugins.slice(0);
pluginsPreview.push(new webpack.optimize.UglifyJsPlugin());
Object.assign(webpackConfigRelease[1], webpackConfig[1], {
    devtool: false,
    plugins: pluginsPreview
});

module.exports = function(grunt) {
    const pkg = grunt.file.readJSON("package.json");
    grunt.initConfig({

        watch: {
            updateWidgetFiles: {
                files: [ "./dist/tmp/src/**/*" ],
                tasks: [ "webpack:develop", "file_append", "compress:dist", "copy:distDeployment", "copy:mpk" ],
                options: {
                    debounceDelay: 250,
                    livereload: true
                }
            },
            sourceFiles: {
                "files": [ "./src/**/*" ],
                "tasks": [ "copy:source" ]
            }
        },

        compress: {
            dist: {
                options: {
                    archive: "./dist/" + pkg.version + "/" + pkg.widgetName + ".mpk",
                    mode: "zip"
                },
                files: [ {
                    expand: true,
                    date: new Date(),
                    store: false,
                    cwd: "./dist/tmp/src",
                    src: [ "**/*" ]
                } ]
            }
        },

        copy: {
            distDeployment: {
                files: [ {
                    dest: "./dist/MxTestProject/deployment/web/widgets",
                    cwd: "./dist/tmp/src/",
                    src: [ "**/*" ],
                    expand: true
                } ]
            },
            mpk: {
                files: [ {
                    dest: "./dist/MxTestProject/widgets",
                    cwd: "./dist/" + pkg.version + "/",
                    src: [ pkg.widgetName + ".mpk" ],
                    expand: true
                } ]
            },
            source: {
                files: [ {
                    dest: "./dist/tmp/src",
                    cwd: "./src/",
                    src: [ "**/*", "!**/*.ts", "!**/*.css" ],
                    expand: true
                } ]
            }
        },
        file_append: {
            addSourceURL: {
                files: [ {
                    append: "\n\n//# sourceURL=GoogleMaps.webmodeler.js\n",
                    input: "dist/tmp/src/GoogleMaps.webmodeler.js"
                },
                {
                    append: "\n\n//# sourceURL=GoogleMapsContext.webmodeler.js\n",
                    input: "dist/tmp/src/GoogleMapsContext.webmodeler.js"
                } ]
            }
        },
        webpack: {
            develop: webpackConfig,
            release: webpackConfigRelease
        },

        clean: {
            build: [
                "./dist/" + pkg.version + "/" + pkg.widgetName + "/*",
                "./dist/tmp/**/*",
                "./dist/MxTestProject/deployment/web/widgets/" + pkg.widgetName + "/*",
                "./dist/MxTestProject/widgets/" + pkg.widgetName + ".mpk"
            ]
        },

        checkDependencies: {
            this: {},
        }
    });

    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-file-append");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-check-dependencies");
    grunt.loadNpmTasks("grunt-webpack");

    grunt.registerTask("default", [ "clean build", "watch" ]);
    grunt.registerTask(
        "clean build",
        "Compiles all the assets and copies the files to the build directory.",
        [ "checkDependencies", "clean:build", "webpack:develop", "file_append", "compress:dist", "copy:mpk" ]
    );
    grunt.registerTask(
        "release",
        "Compiles all the assets and copies the files to the dist directory. Minified without source mapping",
        [ "checkDependencies", "clean:build", "webpack:release", "compress:dist", "copy:mpk" ]
    );
    grunt.registerTask("build", [ "clean build" ]);
};
