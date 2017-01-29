import * as DojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Map, MapProps } from "./components/Map";

class GoogleMaps extends WidgetBase {
    // Properties from Mendix modeler
    private apiKey: string;
    private addressAttribute: string;
    // Internal variables
    private contextObject: mendix.lib.MxObject;

    update(object: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = object;
        this.resetSubscriptions();
        this.updateRendering();

        if (callback) {
            callback();
        }
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering() {
        render(createElement(Map, this.getProps()), this.domNode);
    }

    private resetSubscriptions() {
        this.unsubscribeAll();
        if (this.contextObject) {
            this.subscribe({
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.addressAttribute,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
        }
    }

    private getProps(): MapProps {
        const address = this.contextObject
            ? this.contextObject.get(this.addressAttribute) as string
            : undefined;
        return {
            address,
            apiKey: this.apiKey
        };
    }
}

// Declare widget prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
DojoDeclare("com.mendix.widget.GoogleMaps.GoogleMaps", [ WidgetBase ], (function(Source: any) {
    let result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (GoogleMaps)));
