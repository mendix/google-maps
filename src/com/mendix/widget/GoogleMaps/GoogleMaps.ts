import * as DojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { MapDiv } from "./components/Map";

class GoogleMaps extends WidgetBase {
    // Properties from Mendix modeler
    private apiKey: string;
    private latAttr: string;
    private lngAttr: string;

    // Internal properties
    private map: google.maps.Map;
    private marker: google.maps.Marker;

    postCreate() {
        this.updateRendering = this.updateRendering.bind(this);
        this.loadMap = this.loadMap.bind(this);
    }

    update(object: mendix.lib.MxObject, callback: Function) {
        this.loadGoogleScript(this.updateRendering);
        callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);
        return true;
    }

    private updateRendering(callback?: Function) {
        render(createElement(MapDiv), this.domNode);
        this.loadMap();
    }

    private getGoogleMapsApiUrl() {
        return "https://maps.googleapis.com/maps/api/js?key=" +
            this.apiKey + "&libraries=" +
            [ "geometry", "places", "visualization", "places" ].join();
    }

    private loadGoogleScript(callback?: Function) {
        const script = document.createElement("script");
        script.src = this.getGoogleMapsApiUrl();
        script.onload = () => callback();
        document.body.appendChild(script);
    }

    private loadMap() {
        const mapConfig: google.maps.MapOptions = {
            center: new google.maps.LatLng(Number(this.latAttr), Number(this.lngAttr)),
            zoom: 7
        };
        this.map = new google.maps.Map(document.getElementById("mapNode"), mapConfig);
        const markerConfig = {
            map: this.map,
            position: new google.maps.LatLng(Number(this.latAttr), Number(this.lngAttr))
        };
        this.marker = new google.maps.Marker(markerConfig);
    }
}

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
