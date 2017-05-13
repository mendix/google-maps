import { Component, DOM, Props, ReactElement, createElement } from "react";
import GoogleMap, { GoogleMapLoader, LatLng } from "google-map-react";

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
    zoomLevel: number;
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
    private mapLoader?: GoogleMapLoader;
    private bounds: google.maps.LatLngBounds;

    constructor(props: MapProps) {
        super(props);

        this.state = {
            center: this.defaultCenterLocation,
            isLoaded: false,
            locations: props.locations
        };
        this.handleOnGoogleApiLoaded = this.handleOnGoogleApiLoaded.bind(this);
    }

    render() {
        return DOM.div(
            {
                className: "widget-google-maps-wrapper",
                ref: node => this.mapWrapper = node,
                style: this.getStyle()
            },
            DOM.div({ className: "widget-google-maps" },
                createElement(Alert, { message: this.state.alertMessage }),
                createElement(GoogleMap,
                    {
                        bootstrapURLKeys: { key: this.props.apiKey },
                        center: this.state.center,
                        defaultZoom: this.props.zoomLevel,
                        onGoogleApiLoaded: this.handleOnGoogleApiLoaded,
                        resetBoundsOnResize: true,
                        yesIWantToUseGoogleMapApiInternals: true
                    },
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

    componentWillReceiveProps(nextProps: MapProps) {
        this.setState({ locations: nextProps.locations });
        this.resolveAddresses(nextProps.locations, nextProps.defaultCenterAddress);
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

    private handleOnGoogleApiLoaded(mapLoader: GoogleMapLoader) {
        this.mapLoader = mapLoader;

        this.setState({ isLoaded: true });
        this.resolveAddresses(this.props.locations, this.props.defaultCenterAddress);
    }

    private updateBounds(location: Location) {
        if (this.mapLoader) {
            this.bounds.extend(new google.maps.LatLng(location.latitude as number, location.longitude as number));
            this.mapLoader.map.fitBounds(this.bounds);
            this.mapLoader.map.setZoom(this.setZoom(this.mapLoader.map.getZoom()));
            if (!this.props.defaultCenterAddress) {
                this.setState({ center: { lat: this.bounds.getCenter().lat(), lng: this.bounds.getCenter().lng() } });
            }
        }
    }

    private setZoom(zoom: number): number {
        return zoom > 6
            ? this.props.zoomLevel > 0
                ? this.props.zoomLevel
                : 6
            : zoom;
    }

    private resolveAddresses(locations: Location[], centerAddress?: string) {
        if (this.mapLoader) {
            this.bounds = new google.maps.LatLngBounds();
        }
        if (locations && locations.length) {
            locations.forEach(location => {
                if (!this.validLocation(location) && location.address) {
                    this.getLocation(location.address, locationLookup => {
                        if (locationLookup) {
                            location.latitude = Number(locationLookup.lat);
                            location.longitude = Number(locationLookup.lng);
                            this.setState({ locations });
                            this.updateBounds(location);
                        }
                    });
                } else {
                    this.setState({ locations });
                    this.updateBounds(location);
                }
            });
        }
        if (centerAddress) {
            this.getLocation(centerAddress, location => {
                if (location) {
                    this.setState({ center: location });
                }
            });
        }
    }

    private validLocation(location: Location): boolean {
        const { latitude: lat, longitude: lng } = location;
        return typeof lat === "number" && typeof lng === "number"
            && lat <= 90 && lat >= -90
            && lng <= 180 && lng >= -180
            && !(lat === 0 && lng === 0 );
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
        if (this.state.locations && this.state.locations.length) {
            this.state.locations.map((locationObject, index) => {
                const { latitude, longitude } = locationObject;
                if (this.validLocation(locationObject)) {
                    markerElements.push(createElement(Marker, {
                        key: index,
                        lat: latitude as number,
                        lng: longitude as number
                    }));
                }
            });
        }
        return markerElements;
    }
}
