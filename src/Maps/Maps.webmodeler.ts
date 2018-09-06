import { Component, createElement } from "react";
import { LeafletMap } from "./components/LeafletMap";
import googleApiWrapper from "./components/GoogleMap";
import { validateLocationProps } from "./utils/Validations";
import { Container } from "./utils/namespace";
import { parseStyle } from "./components/MapsContainer";
import MapsContainerProps = Container.MapsContainerProps;
import MapProps = Container.MapProps;

type VisibilityMap<T> = {
    [P in keyof T]: any;
};

// tslint:disable-next-line:class-name
export class preview extends Component<MapsContainerProps, {}> {

    render() {
        const mapsApiToken = this.props.apiToken ? this.props.apiToken.replace(/ /g, "") : undefined;
        const validationMessage = validateLocationProps(this.props);
        const commonProps = {
            allLocations: preview.createSampleLocations(),
            alertMessage: validationMessage,
            fetchingData: false,
            divStyles: parseStyle(this.props.style),
            mapsToken: mapsApiToken,
            ...this.props as MapProps
        };

        if (this.props.mapProvider === "googleMaps") {
            return createElement(googleApiWrapper, {
                ...commonProps
            });
        }

        return createElement(LeafletMap, {
            ...commonProps
        });
    }

    static createSampleLocations(): {latitude: number, longitude: number, url: string }[] {
        return [ {
            latitude: 40.7590110000,
            longitude: -73.9844722000,
            url: ""
        } ];
    }
}

export function getPreviewCss() {
    return (
        require("leaflet/dist/leaflet.css") +
        require("leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css") +
        require("leaflet-defaulticon-compatibility") +
        require("../ui/Maps.css")
    );
}

export function getVisibleProperties(valueMap: MapsContainerProps, visibilityMap: VisibilityMap<MapsContainerProps>) {
    if (valueMap.locations && Array.isArray(valueMap.locations)) {
        valueMap.locations.forEach((location, index) => {
            if (location.dataSourceType) {
                if (!(location.dataSourceType === "microflow")) {
                    visibilityMap.locations[index].dataSourceMicroflow = false;
                }
                if (!(location.dataSourceType === "static")) {
                    visibilityMap.locations[index].staticLatitude = false;
                    visibilityMap.locations[index].staticLongitude = false;
                }
                if (!(location.dataSourceType === "XPath")) {
                    visibilityMap.locations[index].entityConstraint = false;
                }
                if (location.dataSourceType === "static") {
                    visibilityMap.locations[index].locationsEntity = false;
                    visibilityMap.locations[index].latitudeAttribute = false;
                    visibilityMap.locations[index].longitudeAttribute = false;
                }
            }
            if (!(valueMap.mapProvider === "openStreet")) {
                visibilityMap.apiToken = true;
            }
            if (!(valueMap.mapProvider === "googleMaps")) {
                visibilityMap.mapStyles = false;
                visibilityMap.mapTypeControl = false;
                visibilityMap.optionStreetView = false;
                visibilityMap.rotateControl = false;
                visibilityMap.fullScreenControl = false;
            }
            visibilityMap.locations[index].staticMarkerIcon = location.markerImage === "staticImage";
            visibilityMap.locations[index].onClickMicroflow = location.onClickEvent === "callMicroflow";
            visibilityMap.locations[index].onClickNanoflow = location.onClickEvent === "callNanoflow";
            visibilityMap.locations[index].page = location.onClickEvent === "showPage";

            visibilityMap.locations[index].PageLocation = location.onClickEvent === "showPage";
        });
    }

    return visibilityMap;
}
