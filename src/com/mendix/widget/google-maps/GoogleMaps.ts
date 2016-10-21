import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { unmountComponentAtNode } from "react-dom";

class GoogleMapsDojo extends WidgetBase {
    // Properties from Mendix modeler
    private latAttr: string;
    private lngAttr: string;

    update(object: mendix.lib.MxObject, callback: Function) {
        console.log("This is the lat " + this.latAttr + " and long " + this.lngAttr);

        callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }
}

// Declare widget prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.google-maps.GoogleMaps", [ WidgetBase ], (function (Source: any) {
    let result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (GoogleMapsDojo)));
