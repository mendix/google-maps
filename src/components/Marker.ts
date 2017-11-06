import { StatelessComponent, createElement } from "react";

export interface MarkerProps {
    lat: number;
    lng: number;
    url?: string;
}

export const Marker: StatelessComponent<MarkerProps> = (props) => {
    if (props.url) {
        const style = { backgroundImage: `url(${props.url})` };

        return createElement("div", {
            className: "widget-google-maps-marker-url",
            style
        });
    } else {
        return createElement("div", { className: "widget-google-maps-marker" });
    }
};

Marker.displayName = "Marker";
