import { MapMarker } from "./MapMarker";
import { GoogleMapProps, LatLng } from "google-map-react";
import GoogleMap from "google-map-react";
import { Component, DOM, Props, createElement } from "react";

export interface MapProps extends Props<Map> {
    apiKey?: string;
    address?: string;
}

interface MapState {
    isLoaded?: boolean;
    location?: LatLng;
}

export class Map extends Component<MapProps, MapState> {
    // Location of Mendix Netherlands office
    private defaultCenterLocation: LatLng = { lat: 51.9107963, lng: 4.4789878 };
    private googleMap: any;
    constructor(props: MapProps) {
        super(props);

        this.state = {
            isLoaded: false,
            location: null
        };
    }

    componentWillReceiveProps(nextProps: MapProps) {
        if (this.props.address !== nextProps.address) {
            this.getLocation(nextProps.address, (location: LatLng) =>
                this.setLocation(location));
        }
    }

    render() {
        return (
            DOM.div({ className: "mx-google-maps" },
                createElement(GoogleMap, this.getGoogleMapProps(),
                     this.state.location ? this.createMaker(this.state.location) : null
                )
            )
        );
    }
    private getGoogleMapProps(): GoogleMapProps {
        return {
                bootstrapURLKeys: { key: this.props.apiKey },
                center: this.state.location ? this.state.location : this.defaultCenterLocation,
                defaultZoom: 14,
                onGoogleApiLoaded: (map: any) => this.handleMapLoad(map)
                // resetBoundsOnResize: true
            };
    }
    private handleMapLoad(map: any) {
        this.googleMap = map;
        if (this.props.address !== undefined && !this.state.isLoaded) {
            this.getLocation(this.props.address, (location: LatLng) =>
                this.setLocation(location));
        }
        this.registerResizeHandler();
    }

    private registerResizeHandler() {
        google.maps.event.addDomListener(window, "resize", () => {
            google.maps.event.trigger(this.googleMap, "resize");
            this.googleMap.map.setCenter( this.state.location);
        });
    }

    private getLocation(address: string, callback: Function) {
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

    private setLocation(location: LatLng) {
        this.setState({
            isLoaded: true,
            location
        });
    }

    private createMaker(location: LatLng) {
        return createElement(MapMarker, {
                lat: location.lat,
                lng: location.lng
        });
    }
}
