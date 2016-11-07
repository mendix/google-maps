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
    private defaultCenter: string = "Gedempte Zalmhaven 4k, 3011 BT Rotterdam, Netherlands";

    constructor(props: MapProps) {
        super(props);

        this.createMarker = this.createMarker.bind(this);
        this.centerToDefault = this.centerToDefault.bind(this);
        this.state = { isLoaded: typeof google !== "undefined" };
    }

    componentDidUpdate() {
        if (this.state.isLoaded) {
            this.loadMap();
        }
    }

    render() {
        return DOM.div({ className: "mx-google-maps", ref: (c) => this.mapDiv = c });
    }

    componentDidMount() {
        if (!this.state.isLoaded) {
            this.loadGoogleScript();
        } else {
            this.loadMap();
        }
    }

    componentWillUnmount() {
        if (this.map) {
            google.maps.event.clearListeners(this.map, "resize");
        }
    }

    private loadGoogleScript(callback?: Function) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}`;
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
        if (this.props.address === "" || this.props.address === undefined) {
            this.centerToDefault();
        } else {
            this.getLocation(this.props.address, this.createMarker, this.centerToDefault);
        }
        google.maps.event.addDomListener(window, "resize", () => {
            const center = this.map.getCenter();
            google.maps.event.trigger(this.map, "resize");
            this.map.setCenter(center);
        });
    }

    private getLocation(address: string, successCallback: Function, failureCallback?: Function) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                successCallback(results[0].geometry.location);
            } else {
                if (failureCallback) {
                    failureCallback();
                }
            }
        });
    }

    private createMarker(location: google.maps.LatLng) {
        // tslint:disable-next-line
        new google.maps.Marker({ map: this.map, position: location });
        this.map.setCenter(location);
    }

    private centerToDefault() {
        this.getLocation(this.defaultCenter, (defaultLocation: google.maps.LatLng) => {
            this.map.setCenter(defaultLocation);
            mx.ui.error(`Can not find address ${this.props.address}`);
        });
    }
}
