import { Component, DOM, Props, createElement } from "react";
import GoogleMap from "google-map-react";
import { GoogleMapProps, LatLng } from "google-map-react";

import { Marker } from "./Marker";

export interface MapProps extends Props<Map> {
    apiKey?: string;
    address?: string;
}

export interface MapState {
    isLoaded?: Boolean;
    location?: LatLng | null;
}

export class Map extends Component<MapProps, MapState> {
    // Location of Mendix Netherlands office
    private defaultCenterLocation: LatLng = { lat: 51.9107963, lng: 4.4789878 };

    constructor(props: MapProps) {
        super(props);

        this.state = {
            isLoaded: false,
            location: null
        };
    }

    componentWillReceiveProps(nextProps: MapProps) {
        if (this.props.address !== nextProps.address) {
            this.updateAddress(nextProps.address);
        }
    }

    render() {
        return DOM.div({ className: "widget-google-maps" },
            createElement(GoogleMap, this.getGoogleMapProps(),
                this.state.location ? this.createMaker(this.state.location) : null
            )
        );
    }

    private getGoogleMapProps(): GoogleMapProps {
        return {
            bootstrapURLKeys: { key: this.props.apiKey },
            center: this.state.location ? this.state.location : this.defaultCenterLocation,
            defaultZoom: 14,
            onGoogleApiLoaded: () => this.handleOnGoogleApiLoaded(),
            resetBoundsOnResize: true,
            yesIWantToUseGoogleMapApiInternals: true
        };
    }

    private handleOnGoogleApiLoaded() {
        this.setState({ isLoaded: true });
        this.updateAddress(this.props.address);
    }

    private updateAddress(address: string | undefined) {
        if (this.state.isLoaded && address) {
            this.getLocation(address, (location: LatLng) =>
                this.setState({ location })
            );
        } else {
            this.setState({ location: null });
        }
    }

    private getLocation(address: string, callback: (result: LatLng | null) => void) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                callback({
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                });
            } else {
                mx.ui.error(`Can not find address ${this.props.address}`);
                callback(null);
            }
        });
    }

    private createMaker(location: LatLng) {
        return createElement(Marker, {
            lat: location.lat,
            lng: location.lng
        });
    }
}
