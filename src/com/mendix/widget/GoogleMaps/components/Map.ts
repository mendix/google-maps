import { Component, DOM, Props, createElement } from "react";
import GoogleMap from "google-map-react";
import { GoogleMapProps, LatLng } from "google-map-react";
import { List } from "immutable";
import { Marker } from "./Marker";

export interface LocationObject {
    address?: string;
    latitude?: string;
    longitude?: string;
}
export interface MapProps extends Props<Map> {
    apiKey?: string;
    contextGuid?: string;
    locations: LocationObject[];
}

export interface MapState {
    alertMessage?: string;
    isLoaded?: Boolean;
    locations: LocationObject[];
}

export class Map extends Component<MapProps, MapState> {
    // Location of Mendix Netherlands office
    private defaultCenterLocation: LatLng = { lat: 51.9107963, lng: 4.4789878 };
    static defaultProps: MapProps = {
        locations: []
    };
    constructor(props: MapProps) {
        super(props);

        this.state = {
            isLoaded: false,
            locations: props.locations
        };
    }

    componentWillReceiveProps(nextProps: MapProps) {
        if (this.props.locations !== nextProps.locations) {
            this.setState({ isLoaded: true, locations: nextProps.locations });
        }
    }

    render() {
        return DOM.div({ className: "widget-google-maps" },
            createElement(GoogleMap, this.getGoogleMapProps(),
                this.state.locations.map((locationObject: LocationObject, index) => (
                    this.createMaker(locationObject, index)
                )
            ))
        );
    }

    private getGoogleMapProps(): GoogleMapProps {
        return {
            bootstrapURLKeys: { key: this.props.apiKey },
            center: { lat: Number(this.props.locations[0].latitude), lng: Number(this.props.locations[0].longitude) },
            defaultZoom: 7,
            onGoogleApiLoaded: () => this.handleOnGoogleApiLoaded(),
            resetBoundsOnResize: true,
            yesIWantToUseGoogleMapApiInternals: true
        };
    }

    private handleOnGoogleApiLoaded() {
        this.props.locations.filter((location) => !!location.address).map((locationObject: LocationObject, index) =>
            this.getLocation(locationObject.address as string, (location: LatLng) => {
                locationObject.latitude = String(location.lat);
                locationObject.longitude = String(location.lng);
                this.setState({ isLoaded: true, locations: this.props.locations });
            })
        );
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
               // mx.ui.error(`Can not find address ${this.props.address}`);
                callback(null);
            }
        });
    }

    private createMaker(locationObject: LocationObject,index: number) {
        let element: any = undefined;
        if (this.state.isLoaded) {
            if (locationObject.latitude) {
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
