import { PureComponent, createElement } from "react";
import { LeafletMap } from "./components/LeafletMap";
import GoogleMap from "./components/GoogleMap";
import { validateLocationProps } from "./utils/Validations";
import { Container } from "./utils/namespace";
import { parseStyle } from "./components/MapsContainer";
import MapsContainerProps = Container.MapsContainerProps;
import MapProps = Container.MapProps;

type VisibilityMap<T> = {
    [P in keyof T]: any;
};

// tslint:disable-next-line:class-name
export class preview extends PureComponent<MapsContainerProps, {}> {
    private getData = preview.createSampleLocations();

    render() {
        const mapsApiToken = this.props.apiToken ? this.props.apiToken.replace(/ /g, "") : undefined;
        const validationMessage = validateLocationProps(this.props);
        const commonProps = {
            ...this.props as MapProps,
            allLocations: this.getData,
            alertMessage: validationMessage,
            className: this.props.class,
            fetchingData: false,
            divStyles: parseStyle(this.props.style),
            mapsToken: mapsApiToken
        };

        return this.props.mapProvider === "googleMaps"
            ? createElement(GoogleMap, { ...commonProps })
            : createElement(LeafletMap, { ...commonProps, inPreviewMode: true });
    }

    static createSampleLocations(): Container.Location[] {
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
        require("leaflet-defaulticon-compatibility") +
        require("leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css") +
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
                if (!(location.dataSourceType === "nanoflow")) {
                    visibilityMap.locations[index].dataSourceNanoflow = false;
                }
                if (!(location.dataSourceType === "static")) {
                    visibilityMap.locations[index].staticLatitude = false;
                    visibilityMap.locations[index].staticLongitude = false;
                } else {
                    visibilityMap.locations[index].locationsEntity = false;
                    visibilityMap.locations[index].latitudeAttribute = false;
                    visibilityMap.locations[index].longitudeAttribute = false;
                }
                if (!(location.dataSourceType === "XPath")) {
                    visibilityMap.locations[index].entityConstraint = false;
                }
                if (!(location.dataSourceType === "microflow" || location.dataSourceType === "nanoflow")) {
                    visibilityMap.locations[index].inputParameterEntity = false;
                }
            }
            if (valueMap.mapProvider === "openStreet") {
                visibilityMap.apiToken = false;
            }
            if (!(valueMap.mapProvider === "googleMaps")) {
                visibilityMap.mapStyles = false;
                visibilityMap.mapTypeControl = false;
                visibilityMap.optionStreetView = false;
                visibilityMap.rotateControl = false;
                visibilityMap.fullScreenControl = false;
            }
            if (!(location.onClickEvent === "showPage")) {
                visibilityMap.locations[index].page = false;
                visibilityMap.locations[index].PageLocation = false;
            }
            visibilityMap.locations[index].staticMarkerIcon = location.markerImage === "staticImage";
            visibilityMap.locations[index].onClickMicroflow = location.onClickEvent === "callMicroflow";
            visibilityMap.locations[index].onClickNanoflow = location.onClickEvent === "callNanoflow";
            visibilityMap.locations[index].systemImagePath = false;
            visibilityMap.locations[index].markerImage = false;
            visibilityMap.locations[index].staticMarkerIcon = false;
            visibilityMap.locations[index].markerImageAttribute = false;
            visibilityMap.markerImages = false;
        });
    }

    return visibilityMap;
}
