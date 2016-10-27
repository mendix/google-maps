import { Component, DOM, Props } from "react";

import { Marker } from "./Marker";

export interface MapProps extends Props<Map> {
    apiKey?: string;
    address: string;
    defaultCenter?: string;
}

interface MapState {
    isLoaded: boolean;
}

export class Map extends Component<MapProps, MapState> {
    private map: google.maps.Map;
    private mapDiv: HTMLElement;

    constructor(props: MapProps) {
        super(props);

        this.createMarker = this.createMarker.bind(this);
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
            mx.ui.error("Could not load Google Maps script. Please check your internet connection");
        };
        document.body.appendChild(script);
    }

    private loadMap() {
        const mapConfig: google.maps.MapOptions = {
            zoom: 7
        };
        this.map = new google.maps.Map(this.mapDiv, mapConfig);
        this.getLocation(this.props.address, this.createMarker);
    }

    getLocation(address: string, callback: (location: google.maps.LatLng) => void) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                callback(results[0].geometry.location);
            } else {
                callback(null);
            }
        });
    }

    private createMarker(location: google.maps.LatLng) {
        if (location) {
            Marker({ location, map: this.map });
            this.map.setCenter(location);
        } else {
            this.getLocation(this.props.defaultCenter, defaultLocation => {
                this.map.setCenter(defaultLocation);
                logger.warn("Could not find address, map is set to default location");
            });
        }
    }
}
