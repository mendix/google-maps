import { Component, DOM, ReactElement, createElement } from "react";
import { Map, MapProps } from "./components/Map";
import { Overlay } from "./components/Overlay";
import { Alert } from "./components/Alert";
import GoogleMapContainer, { GoogleMapContainerProps } from "./components/GoogleMapContainer";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<GoogleMapContainerProps, {}> {

    render() {
        const warnings = GoogleMapContainer.validateProps(this.props);
        let reactElement: ReactElement<{}>;
        if (!warnings) {
            reactElement = createElement(Map, this.transformProps(this.props));
        } else {
            reactElement = DOM.div({},
                createElement(Alert, { message: warnings }),
                createElement(Map, this.transformProps(this.props))
            );
        }
        return createElement(Overlay, {}, reactElement);
    }

    private transformProps(props: GoogleMapContainerProps): MapProps {
        return {
            apiKey: props.apiKey,
            defaultCenterAddress: props.defaultCenterAddress,
            height: props.height,
            heightUnit: props.heightUnit,
            locations: [ { latitude: 51.9107963, longitude:  4.4789878 } ],
            optionDrag: props.optionDrag,
            optionMapControl: props.optionMapControl,
            optionScroll: props.optionScroll,
            optionStreetView: props.optionStreetView,
            optionZoomControl: props.optionZoomControl,
            width: props.width,
            widthUnit: props.widthUnit,
            zoomLevel: props.zoomLevel
        };
    }
}

export function getPreviewCss() {
    return require("./ui/GoogleMaps.css");
}
