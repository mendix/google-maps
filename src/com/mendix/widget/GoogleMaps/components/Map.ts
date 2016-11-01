import { Marker } from "./Marker";
import { Component, DOM, Props } from "react";

export interface MapProps extends Props<Map> {
    apiKey?: string;
    address: string;
}

interface MapState {
    isLoaded: boolean;
}

export class Map extends Component<MapProps, MapState> {
    static defaultProps: MapProps = {
        address: undefined
    };
    private map: google.maps.Map;
    private mapDiv: HTMLElement;
    private defaultCenter: "Gedempte Zalmhaven 4k, 3011 BT Rotterdam, Netherlands";

    constructor(props: MapProps) {
        super(props);

        this.createMarker = this.createMarker.bind(this);
        this.centerToDefault = this.centerToDefault.bind(this);
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

    componentWillUnmount() {
        google.maps.event.clearListeners(this.map, "resize");
    }

    render() {
        return DOM.div({ className: "mx-google-maps", ref: (c) => this.mapDiv = c });
    }

    private getGoogleMapsApiUrl() {
        return `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}`;
    }

    getMap() {
        return this.map;
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
        const mapConfig: google.maps.MapOptions = { zoom: 14 };
        this.map = new google.maps.Map(this.mapDiv, mapConfig);
        this.getLocation(this.props.address !== undefined
            ? this.props.address
            : this.defaultCenter,
            this.createMarker,
            this.centerToDefault
        );
        google.maps.event.addDomListener(window, "resize", () => {
            const center = this.map.getCenter();
            google.maps.event.trigger(this.map, "resize");
            this.map.setCenter(center);
        });
    }

    getLocation(address: string, successCallback: Function, failureCallback?: Function) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                successCallback(results[0].geometry.location);
            } else {
                failureCallback();
            }
        });
    }

    private createMarker(location: google.maps.LatLng) {
        Marker({ location, map: this.map });
        this.map.setCenter(location);
    }

    private centerToDefault() {
        this.getLocation(this.defaultCenter, (defaultLocation: google.maps.LatLng) => {
            this.map.setCenter(defaultLocation);
            mx.ui.error(`Could not find location from address ${this.props.address}`);
        });
    }
}
