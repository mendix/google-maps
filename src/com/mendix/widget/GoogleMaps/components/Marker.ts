import { DOM } from "react";

export const Marker = (props: { lat: number, lng: number}) =>
    DOM.div({ className: "widget-google-maps-marker" });
