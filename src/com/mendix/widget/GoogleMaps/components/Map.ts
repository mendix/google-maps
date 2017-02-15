import { Component, DOM, Props, createElement } from "react";
import GoogleMap from "google-map-react";
import { GoogleMapProps, LatLng } from "google-map-react";

import { Alert } from "./Alert";
import { Marker } from "./Marker";

export interface Location {
    address?: string;
    latitude?: number;
    longitude?: number;
}
export interface MapProps extends Props<Map> {
    apiKey?: string;
    defaultCenterAddress: string;
    locations: Location[];
}

export interface MapState {
    alertMessage?: string;
    center?: LatLng;
    isLoaded?: Boolean;
    locations?: Location[];
}

export class Map extends Component<MapProps, MapState> {
    // Location of Mendix Netherlands office
    private defaultCenterLocation: LatLng = { lat: 51.9107963, lng: 4.4789878 };
    static defaultProps: MapProps = {
        defaultCenterAddress: "",
        locations: []
    };
    constructor(props: MapProps) {
        super(props);

        this.state = {
            center: this.defaultCenterLocation,
            isLoaded: false,
            locations: props.locations
        };
    }

    componentWillReceiveProps(nextProps: MapProps) {
        if (this.props.locations !== nextProps.locations) {
            nextProps.locations.filter((location) => !!location.address).map((locationObject: Location) =>
                this.getLocation(locationObject.address as string, (location: LatLng) => {
                    if (location) {
                        locationObject.latitude = Number(location.lat);
                        locationObject.longitude = Number(location.lng);
                        this.setState({ locations: nextProps.locations });
                    }
                })
            );
        }
        this.setState({ locations: nextProps.locations });
    }

    render() {
        return DOM.div({ className: "widget-google-maps" },
            createElement(Alert, { message: this.state.alertMessage }),
            createElement(GoogleMap, this.getGoogleMapProps(),
                this.state.locations
                    ? this.state.locations.map((locationObject: Location, index) =>
                        (
                            this.createMaker(locationObject, index)
                        ))
                    : undefined
            )
        );
    }

    private getGoogleMapProps(): GoogleMapProps {
        return {
            bootstrapURLKeys: { key: this.props.apiKey },
            center: this.state.center,
            defaultZoom: 7,
            onGoogleApiLoaded: () => this.handleOnGoogleApiLoaded(),
            resetBoundsOnResize: true,
            yesIWantToUseGoogleMapApiInternals: true
        };
    }

    private handleOnGoogleApiLoaded() {
        this.setState({ isLoaded: true });
        this.centerMap();
        this.plotAddresses();
    }

    private centerMap() {
        this.getLocation(this.props.defaultCenterAddress as string, (location: LatLng) => {
            if (location) {
                this.setState({ center: location });
            } else {
                this.setState({ center: this.defaultCenterLocation });
            }
        });
    }

    private plotAddresses() {
        this.props.locations.filter((location) => location.address && !location.latitude)
            .map((locationObject: Location, index) => {
                this.getLocation(locationObject.address as string, (location: LatLng) => {
                    if (location) {
                        locationObject.latitude = Number(location.lat);
                        locationObject.longitude = Number(location.lng);
                        this.setState({ locations: this.props.locations });
                    }
                });
            });
    }

    private getLocation(address: string, callback: (result: LatLng | null) => void) {
        if (this.state.isLoaded) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    callback({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    });
                } else {
                    this.setState({ alertMessage: `Can not find address ${address}` });
                    callback(null);
                }
            });
        } else {
            callback(null);
        }
    }

    private createMaker(locationObject: Location, index: number) {
        let element: any;
        if (this.state.isLoaded) {
            if (locationObject.latitude && locationObject.longitude ) {
                element = createElement(Marker, {
                    key: index,
                    lat: Number(locationObject.latitude),
                    lng: Number(locationObject.longitude)
                });
            }
        }
        return element;
    }
}
