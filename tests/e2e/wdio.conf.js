const debug = process.env.DEBUG;
const maps = process.env.MAPS;
const url = maps ? "https://leafletmaps.mxapps.io/" : "https://googlemaps101.mxapps.io/";

exports.config = {
    host: "127.0.0.1",
    port: 4444,
    specs: maps ? [ "./dist/e2e/Maps/**/*.spec.js" ] : [ "./dist/e2e/GoogleMap/**/*.spec.js" ],
    maxInstances: debug ? 1 : 5,
    capabilities: [ {
        maxInstances: 1,
        browserName: "chrome"
    } ],
    sync: true,
    logLevel: "silent",
    coloredLogs: true,
    bail: 0,
    screenshotPath: "dist/wdio/",
    baseUrl: debug ? "http://localhost:8080/" : url,
    waitforTimeout: 30000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 0,
    services: [ "selenium-standalone" ],

    framework: "jasmine",
    reporters: [ "spec" ],
    execArgv: debug ? [ "--inspect" ] : undefined,
    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        defaultTimeoutInterval: debug ? (60 * 60 * 1000) : (30 * 1000),
        expectationResultHandler: function(passed, assertion) {
            if (passed) {
                return;
            }
            browser.saveScreenshot(
                "dist/wdio/assertionError_" + assertion.error.message + ".png"
            );
        }
    }
};
