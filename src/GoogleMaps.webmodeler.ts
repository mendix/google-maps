import { Component, DOM, createElement } from "react";
import { Map, MapProps } from "./components/Map";
import { Alert } from "./components/Alert";
import GoogleMapContainer, { GoogleMapContainerProps } from "./components/GoogleMapContainer";

import * as css from "./ui/GoogleMaps.css";

export class preview extends Component<GoogleMapContainerProps, {}> {

    componentWillMount() {
        this.addPreviewStyle("widget-googlemaps");
    }

    render() {
        const warnings = GoogleMapContainer.validateProps(this.props);
        if (!warnings) {
            return createElement(Map, this.transformProps(this.props));
        } else {
            return DOM.div({},
                createElement(Alert, { message: warnings } ),
                createElement(Map, this.transformProps(this.props))
            );
        }
    }

    private transformProps(props: GoogleMapContainerProps): MapProps {
        return {
            apiKey: props.apiKey,
            defaultCenterAddress: props.defaultCenterAddress,
            height: props.height,
            heightUnit: props.heightUnit,
            locations: [ { latitude: 51.9107963, longitude:  4.4789878 } ],
            width: props.width,
            widthUnit: props.widthUnit,
            zoomLevel: props.zoomLevel
        };
    }

    private addPreviewStyle(styleId: string) {
        // This workaround is to load style in the preview temporary till mendix has a better solution
        const iFrame = document.getElementsByClassName("t-page-editor-iframe")[0] as HTMLIFrameElement;
        const iFrameDoc = iFrame.contentDocument;
        if (!iFrameDoc.getElementById(styleId)) {
            const styleTarget = iFrameDoc.head || iFrameDoc.getElementsByTagName("head")[0];
            const styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.setAttribute("id", styleId);
            styleElement.appendChild(document.createTextNode(css));
            styleTarget.appendChild(styleElement);
        }
    }
}
