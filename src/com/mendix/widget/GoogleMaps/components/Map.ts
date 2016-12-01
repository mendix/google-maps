import { Component, DOM, Props, createElement } from "react";
import GoogleMap from "google-map-react";
import { GoogleMapProps, LatLng } from "google-map-react";

import { Marker } from "./Marker";

export interface MapProps extends Props<Map> {
    apiKey?: string;
    address?: string;
}

interface MapState {
    location?: LatLng;
}

export class Map extends Component<MapProps, MapState> {
    // Location of Mendix Netherlands office
    private defaultCenterLocation: LatLng = { lat: 51.9107963, lng: 4.4789878 };

    constructor(props: MapProps) {
        super(props);

        this.state = {
            location: null
        };
    }

    componentWillReceiveProps(nextProps: MapProps) {
        if (this.props.address !== nextProps.address) {
            this.getLocation(nextProps.address, (location: LatLng) =>
                this.setState({ location })
            );
        }
    }

    render() {
        return DOM.div({ className: "mx-google-maps" },
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
            onGoogleApiLoaded: () => this.onGoogleApiLoaded(),
            resetBoundsOnResize: true
        };
    }

    private onGoogleApiLoaded() {
        this.getLocation(this.props.address, (location: LatLng) =>
            this.setState({ location })
        );
    }

    private getLocation(address: string, callback: Function) {
        if (address) {
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
        } else {
            callback(null);
        }
    }

    private createMaker(location: LatLng) {
        return createElement(Marker, {
            lat: location.lat,
            lng: location.lng
        });
    }
}
