import { Component, DOM } from "react";

export class MapMarker extends Component<{}, {}> {
    render() {
        return ( DOM.div({ className: "mx-google-maps-marker" }) );
    }
}
