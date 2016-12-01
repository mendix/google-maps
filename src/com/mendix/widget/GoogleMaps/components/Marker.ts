import { DOM } from "react";

export const Marker = (props: { lat: number, lng: number}) =>
    DOM.div({ className: "mx-google-maps-marker" });
