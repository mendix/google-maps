import { Component, createElement } from "react";
import { Map, MapProps } from "./components/Map";
import GoogleMapContainer, { GoogleMapContainerProps } from "./components/GoogleMapContainer";

export class preview extends Component<GoogleMapContainerProps, {}> {
    render() {
        return createElement(Map, this.transformProps(this.props));
    }

    private transformProps(props: GoogleMapContainerProps): MapProps {
        return {
                apiKey: props.apiKey,
                defaultCenterAddress: props.defaultCenterAddress,
                height: props.height,
                heightUnit: props.heightUnit,
                locations: [],
                width: props.width,
                widthUnit: props.widthUnit,
                zoomLevel: props.zoomLevel
        };
    }
}
