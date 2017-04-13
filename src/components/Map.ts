import { Component, DOM, Props, ReactElement, createElement } from "react";
import GoogleMap from "google-map-react";
import { GoogleMapProps, LatLng } from "google-map-react";

import { Alert } from "./Alert";
import { Marker, MarkerProps } from "./Marker";

import "../ui/GoogleMaps.css";

export interface Location {
    address?: string;
    latitude?: number;
    longitude?: number;
}
export interface MapProps extends Props<Map> {
    apiKey?: string;
    defaultCenterAddress: string;
    height: number;
    heightUnit: "percentageOfWidth" | "percentageOfParent" | "pixels";
    locations: Location[];
    width: number;
    widthUnit: "percentage" | "pixels";
}

export interface MapState {
    alertMessage?: string;
    center?: LatLng;
    isLoaded?: boolean;
    locations?: Location[];
}

export class Map extends Component<MapProps, MapState> {
    // Location of Mendix Netherlands office
    private defaultCenterLocation: LatLng = { lat: 51.9107963, lng: 4.4789878 };
    private mapWrapper: HTMLElement;

    constructor(props: MapProps) {
        super(props);

        this.state = {
            center: this.defaultCenterLocation,
            isLoaded: false,
            locations: props.locations
        };
    }

    componentWillReceiveProps(nextProps: MapProps) {
        this.setState({ locations: nextProps.locations });
        this.centerMap(nextProps.locations );
        this.resolveAddresses(nextProps.locations);
    }

    render() {
        // tslint:disable-next-line:max-line-length
        return DOM.div({ className: "widget-google-maps-wrapper", ref: node => this.mapWrapper = node, style: this.getStyle() },
            DOM.div({ className: "widget-google-maps" },
                createElement(Alert, { message: this.state.alertMessage }),
                createElement(GoogleMap, this.getGoogleMapProps(),
                    this.createMakers()
                )
            )
        );
    }

    componentDidMount() {
        const wrapperElement = this.mapWrapper.parentElement;
        if (this.props.heightUnit === "percentageOfParent" && wrapperElement) {
            wrapperElement.style.height = "100%";
            wrapperElement.style.width = "100%";
        }
    }

    private getStyle(): object {
        const style: { paddingBottom?: string; width: string, height?: string } = {
            width: this.props.widthUnit === "percentage" ? `${this.props.width}%` : `${this.props.width}`
        };
        if (this.props.heightUnit === "percentageOfWidth") {
            style.paddingBottom = `${this.props.height}%`;
        } else if (this.props.heightUnit === "pixels") {
            style.paddingBottom = `${this.props.height}`;
        } else if (this.props.heightUnit === "percentageOfParent") {
            style.height = `${this.props.height}%`;
        }
        return style;
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
        this.centerMap(this.props.locations);
        this.resolveAddresses(this.props.locations);
    }

    private centerMap(locations: Location[]) {
        if (locations.length === 1) {
            const firstLocation = locations[0];
            if (firstLocation.latitude && firstLocation.longitude) {
                this.setState({ center: { lat: firstLocation.latitude, lng: firstLocation.longitude } });
            } else {
                this.updateCenterStateByAddress(firstLocation.address as string);
            }
        } else {
            this.updateCenterStateByAddress(this.props.defaultCenterAddress);
        }
    }

    private updateCenterStateByAddress(address: string) {
        this.getLocation(address, (location: LatLng ) => {
            if (location) {
                this.setState({ center: location });
            } else {
                this.setState({ center: this.defaultCenterLocation });
            }
        });
    }

    private resolveAddresses(locations: Location[]) {
        locations.forEach(location => {
            if (location.address && !location.latitude && !location.longitude) {
                this.getLocation(location.address, locationLookup => {
                    if (locationLookup) {
                        location.latitude = Number(locationLookup.lat);
                        location.longitude = Number(locationLookup.lng);
                        this.setState({ locations });
                    }
                });
            }
        });
    }

    private getLocation(address: string, callback: (result?: LatLng ) => void) {
        if (this.state.isLoaded) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    this.setState({ alertMessage: "" });
                    callback({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    });
                } else {
                    this.setState({ alertMessage: `Can not find address ${address}` });
                    callback();
                }
            });
        } else {
            callback();
        }
    }

    private createMakers(): Array<ReactElement<MarkerProps>> {
        const markerElements: Array<ReactElement<MarkerProps>> = [];
        if (this.state.locations) {
            this.state.locations.map((locationObject, index) => {
                // tslint:disable-next-line:max-line-length
                if (locationObject.latitude && locationObject.latitude !== 0 && locationObject.longitude && locationObject.longitude !== 0) {
                    markerElements.push(createElement(Marker, {
                        key: index,
                        lat: Number(locationObject.latitude),
                        lng: Number(locationObject.longitude)
                    }));
                }
            });
        }
        return markerElements;
    }
}
