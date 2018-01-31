import { Component, ReactElement, createElement } from "react";
import { Map, MapProps } from "./components/Map";
import { Alert } from "./components/Alert";
import { GoogleMapContainerProps } from "./components/GoogleMapContainer";
import { parseStaticLocations } from "./utils/ContainerUtils";
import { ValidateConfigs } from "./utils/ValidateConfigs";

declare function require(name: string): string;
type VisibilityMap = {
    [P in keyof GoogleMapContainerProps]: boolean;
};

// tslint:disable-next-line class-name
export class preview extends Component<GoogleMapContainerProps, {}> {
    render() {
        const warnings = ValidateConfigs.validate(this.props);
        let reactElement: ReactElement<{}>;
        if (!warnings) {
            reactElement = createElement(Map, preview.transformProps(this.props));
        } else {
            reactElement = createElement("div", {},
                createElement(Alert, {
                    bootstrapStyle: "danger",
                    className: "widget-google-maps-alert",
                    message: warnings
                }),
                createElement(Map, preview.transformProps(this.props))
            );
        }
        return createElement("div", {}, reactElement);
    }

    private static transformProps(props: GoogleMapContainerProps): MapProps {
        const locations = props.dataSource === "static"
            ? parseStaticLocations(props)
            : [];
        return {
            apiKey: props.apiKey,
            autoZoom: props.autoZoom,
            defaultCenterAddress: props.defaultCenterAddress,
            defaultCenterLatitude: props.defaultCenterLatitude,
            defaultCenterLongitude: props.defaultCenterLongitude,
            height: props.height,
            heightUnit: props.heightUnit,
            locations,
            optionDrag: props.optionDrag,
            optionMapControl: props.optionMapControl,
            optionScroll: props.optionScroll,
            optionStreetView: props.optionStreetView,
            optionZoomControl: props.optionZoomControl,
            style: {},
            mapStyles: props.mapStyles,
            width: props.width,
            widthUnit: props.widthUnit,
            zoomLevel: props.zoomLevel
        };
    }
}

export function getVisibleProperties(valueMap: GoogleMapContainerProps, visibilityMap: VisibilityMap) {
    if (valueMap.dataSource === "static") {
        visibilityMap.addressAttribute = false;
        visibilityMap.dataSourceMicroflow = false;
        visibilityMap.entityConstraint = false;
        visibilityMap.locationsEntity = false;
        visibilityMap.latitudeAttribute = false;
        visibilityMap.longitudeAttribute = false;
    } else if (valueMap.dataSource === "XPath") {
        visibilityMap.addressAttribute = true;
        visibilityMap.dataSourceMicroflow = false;
        visibilityMap.entityConstraint = true;
        visibilityMap.locationsEntity = true;
        visibilityMap.latitudeAttribute = true;
        visibilityMap.longitudeAttribute = true;
    } else if (valueMap.dataSource === "context") {
        visibilityMap.addressAttribute = true;
        visibilityMap.dataSourceMicroflow = false;
        visibilityMap.entityConstraint = false;
        visibilityMap.locationsEntity = false;
        visibilityMap.latitudeAttribute = true;
        visibilityMap.longitudeAttribute = true;
    } else if (valueMap.dataSource === "microflow") {
        visibilityMap.addressAttribute = true;
        visibilityMap.dataSourceMicroflow = true;
        visibilityMap.entityConstraint = false;
        visibilityMap.locationsEntity = true;
        visibilityMap.latitudeAttribute = true;
        visibilityMap.longitudeAttribute = true;
    }

    return visibilityMap;
}

export function getPreviewCss() {
    return require("./ui/GoogleMaps.css");
}
