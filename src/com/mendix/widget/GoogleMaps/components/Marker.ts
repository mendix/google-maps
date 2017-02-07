import { DOM, StatelessComponent } from "react";

export const Marker: StatelessComponent<{ lat: number, lng: number}> = (props) =>
    DOM.div({ className: "widget-google-maps-marker" });
