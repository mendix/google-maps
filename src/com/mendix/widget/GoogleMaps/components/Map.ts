
import * as _ from "lodash";
import { Component, DOM, Props, createElement } from "react";
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";

export interface MapProps extends Props<Map> {
    apiKey?: string;
    address?: string;
}

const MxGoogleMap = _.flowRight(
    withScriptjs,
    withGoogleMap,
)((props: any) => (
    createElement(GoogleMap, {
        defaultCenter: { lat: 59.938043, lng: 30.337157 },
        defaultZoom: 14,
        onClick: props.onMapClick,
        ref: props.onMapLoad
    }, createElement(Marker, { position: { lat: 59.938043, lng: 30.337157 } }))
));

export class Map extends Component<MapProps, {}> {
    mapComponent: any;
    google: any;
    static defaultProps: MapProps = {
        address: undefined
    };

    constructor(props: MapProps) {
        super(props);
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.state = { isLoaded: typeof google !== "undefined" };
    }

    private handleMapLoad(mapComponent: any) {
        this.mapComponent = mapComponent;
        this.google = google;
    }
    handleMapClick(event: any) {
       //
    }

    render() {
        return (
            createElement(MxGoogleMap, {
                containerElement: DOM.div({ style: { height: "100%" } }),
                googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec",
                loadingElement: DOM.div({ style: { height: 500 } }, "Loading map"),
                mapElement: DOM.div({ style: { height: 500 } }),
                onMapClick: this.handleMapClick,
                onMapLoad: this.handleMapLoad
            })
        );
    }

    componentDidMount() {
        //
    }

    componentWillUnmount() {
        //
    }
}
