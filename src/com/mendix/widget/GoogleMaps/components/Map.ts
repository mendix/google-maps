import { Component, DOM, Props } from "react";

import { Marker } from "./Marker";

export interface MapProps extends Props<Map> {
    apiKey: string;
    address: string;
}

interface MapState {
    isLoaded: boolean;
}

export class Map extends Component<MapProps, MapState> {
    private map: google.maps.Map;
    private mapDiv: HTMLElement;
    private geocoder: google.maps.Geocoder;

    constructor(props: MapProps) {

        super(props);
        this.loadGoogleScript = this.loadGoogleScript.bind(this);
        this.loadMap = this.loadMap.bind(this);

        this.state = { isLoaded: typeof google !== "undefined" ? true : false };
        if (!this.state.isLoaded) {
            this.loadGoogleScript();
        }
    }

    componentDidUpdate() {
        this.loadMap();
    }

    componentDidMount() {
        if (this.state.isLoaded) {
            this.loadMap();
        }
    }

    render() {
        return DOM.div({ className: "mx-google-maps", ref: (c) => this.mapDiv = c });
    }

    private getGoogleMapsApiUrl() {
        return `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}`;
    }

    private loadGoogleScript(callback?: Function) {
        const script = document.createElement("script");
        script.src = this.getGoogleMapsApiUrl();
        script.onload = () => {
            this.setState({ isLoaded: true });
        };
        script.onerror = () => {
            mx.ui.error("Could not load google maps script. Please check your internet connection");
        };
        document.body.appendChild(script);
    }

    private loadMap() {
        const mapConfig: google.maps.MapOptions = {
            zoom: 7
        };
        this.map = new google.maps.Map(this.mapDiv, mapConfig);
        this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({ address: this.props.address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                Marker({ location: results[0].geometry.location, map: this.map });
                this.map.setCenter(results[0].geometry.location);
            } else {
                mx.ui.error("Could not find the specified address");
            }
        });
    }
}
