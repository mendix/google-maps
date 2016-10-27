import { Marker } from "./Marker";
import { Component, DOM, Props } from "react";

export interface MapProps extends Props<Map> {
    apiKey?: string;
    address: string;
    defaultCenter?: string;
}

interface MapState {
    isLoaded: boolean;
}

export class Map extends Component<MapProps, MapState> {
    static defaultProps: MapProps = {
        address: "",
        defaultCenter: "Gedempte Zalmhaven 4k, 3011 BT Rotterdam, Netherlands"
    };
    private map: google.maps.Map;
    private mapDiv: HTMLElement;

    constructor(props: MapProps) {
        super(props);

        this.createMarker = this.createMarker.bind(this);
        this.state = { isLoaded: typeof google !== "undefined" };
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
        script.onload = () => { this.setState({ isLoaded: true }); };
        script.onerror = () => {
            mx.ui.error("Could not load Google Maps script. Please check your internet connection");
        };
        document.body.appendChild(script);
    }

    private loadMap() {
        const mapConfig: google.maps.MapOptions = { zoom: 14 };
        this.map = new google.maps.Map(this.mapDiv, mapConfig);
        this.getLocation(this.props.address, this.createMarker);
        google.maps.event.addDomListener(window, "resize", () => {
            const center = this.map.getCenter();
            google.maps.event.trigger(this.map, "resize");
            this.map.setCenter(center);
        });
    }

    private getLocation(address: string, callback: (location: google.maps.LatLng) => void) {
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
                Marker({ location: defaultLocation, map: this.map });
                this.map.setCenter(defaultLocation);
                mx.ui.error("Could not find address " + this.props.address +
                    ". Map is set to default location");
            });
        }
    }
}
