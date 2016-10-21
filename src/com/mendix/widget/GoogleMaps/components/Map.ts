import { DOM } from "react";

export interface MapProps {
    lat?: string;
    long?: string;
}

export const Map = (props: MapProps) => {
    return (
        DOM.div({ className: "google-map-container" },
            DOM.div({  className: "google-map" })
        )
    );
};
