import * as DojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { LocationObject, Map, MapProps } from "./components/Map";
import { MapData, MapDataOptions, DataSource } from "./MapData";
import { Alert } from "./components/Alert";
class GoogleMaps extends WidgetBase {
    // Properties from Mendix modeler
    apiKey: string;
    dataSource: DataSource;
    dataSourceMicroflow: string;
    entityConstraint: string;
    locationsEntity: string;
    locationAddressAttribute: string;
    locationLatitudeAttribute: string;
    locationLongitudeAttribute: string;
    staticLocations: LocationObject[];

    private contextObject: mendix.lib.MxObject;
    private dataHandler: MapData;

    postCreate() {
        const dataOptions: MapDataOptions = {
            apiKey: this.apiKey,
            dataSource: this.dataSource,
            dataSourceMicroflow: this.dataSourceMicroflow,
            entityConstraint: this.entityConstraint,
            locationsEntity: this.locationsEntity,
            locationAddressAttribute: this.locationAddressAttribute,
            locationLatitudeAttribute: this.locationLatitudeAttribute,
            locationLongitudeAttribute: this.locationLongitudeAttribute,
            staticLocations: this.staticLocations
        };
        this.dataHandler = new MapData(dataOptions, (alert, locations) =>
            this.updateRendering(alert, locations)
        );
    }

    update(contextObject: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = contextObject;
        this.resetSubscriptions();
        this.dataHandler.setContext(contextObject).validateAndFetch();

        if (callback) callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering(alert?: string, locations: LocationObject[] = []) {
        if (alert) {
            render(createElement(Alert, { message: alert }), this.domNode);
        } else {
            render(createElement(Map, {
                apiKey: this.apiKey,
                contextGuid: this.contextObject ? this.contextObject.getGuid() : undefined,
                locations
            }), this.domNode);
        }
    }

    private resetSubscriptions() {
        this.unsubscribeAll();

        if (this.contextObject) {
            this.subscribe({
                callback: () => this.dataHandler.validateAndFetch(),
                guid: this.contextObject.getGuid()
            });
            // TODO listen to attributes
        }
    }
}

// Declare widget prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
DojoDeclare("com.mendix.widget.GoogleMaps.GoogleMaps", [ WidgetBase ], (function(Source: any) {
    const result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(GoogleMaps)));
