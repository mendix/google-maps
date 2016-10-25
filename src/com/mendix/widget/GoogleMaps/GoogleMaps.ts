import * as DojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Map, MapProps } from "./components/Map";

class GoogleMaps extends WidgetBase {
    // Properties from Mendix modeler
    private apiKey: string;
    private address: string;
    private defaultAddress: string;

    // internal variables
    private contextObject: mendix.lib.MxObject;

    postCreate() {
        this.updateRendering = this.updateRendering.bind(this);
    }

    update(object: mendix.lib.MxObject, callback: Function) {
        this.contextObject = object;
        this.resetSubscriptions();
        this.updateRendering();
        callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);
        return true;
    }

    updateRendering() {
        if (this.contextObject) {
            this.domNode.className = this.domNode.className.replace("hidden", "");
            render(createElement(Map, this.getProps()), this.domNode);
        } else {
            this.domNode.className = `${this.domNode.className} hidden`;
        }
    }

    resetSubscriptions() {
        this.unsubscribeAll();
        if (this.contextObject) {
            this.subscribe({
                callback: guid => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
        }
    }

    private getProps(): MapProps {
        return {
            address: this.contextObject ?
                String(this.contextObject.get(this.address)) : this.defaultAddress,
            apiKey: this.apiKey
        };
    }
}

// Declare widget prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
DojoDeclare("com.mendix.widget.GoogleMaps.GoogleMaps", [ WidgetBase ], (function (Source: any) {
    let result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (GoogleMaps)));
