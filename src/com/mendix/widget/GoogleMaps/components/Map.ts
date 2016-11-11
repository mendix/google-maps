
import * as _ from "lodash";
import { Component, DOM, Props, createElement } from "react";
import { GoogleMap, LatLng, Marker, withGoogleMap } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";

export interface MapProps extends Props<Map> {
    apiKey?: string;
    address?: string;
}

interface MapState {
    isLoaded?: boolean;
    location?: LatLng;
}

const MxGoogleMap = _.flowRight(withScriptjs, withGoogleMap)((props: any) => (
    createElement(GoogleMap, {
        center: props.center,
        defaultZoom: 14,
        ref: props.onMapLoad
    }, props.marker)
));

export class Map extends Component<MapProps, MapState> {
    private defaultLocation: LatLng = { lat: 51.9107963, lng: 4.4789878 };

    constructor(props: MapProps) {
        super(props);

        this.state = {
            isLoaded: false,
            location: this.defaultLocation
        };
    }

    render() {
        const isDefaultLocation: boolean = this.state.location.lat !== this.defaultLocation.lat
        && this.state.location.lng !== this.defaultLocation.lng;

        return (
            createElement(MxGoogleMap, {
                center: { lat: this.state.location.lat, lng: this.state.location.lng },
                containerElement: DOM.div({ className: "mx-google-map-container" }),
                googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}`,
                loadingElement: DOM.div({ className: "mx-google-maps" }, "Loading map"),
                mapElement: DOM.div({ className: "mx-google-maps" }),
                marker: isDefaultLocation ? this.createMaker() : null,
                onMapLoad: () => this.handleMapLoad()
            })
        );
    }

    componentDidMount() {
        //
    }

    componentWillReceiveProps(nextProps: MapProps) {
        if (this.props.address !== nextProps.address) {
            this.getLocation(nextProps.address,
                (location: google.maps.LatLng) => this.setLocation(location.lat(), location.lng()));
        }
    }

    componentWillUnmount() {
        //
    }

    private handleMapLoad() {
        if (this.props.address !== undefined && !this.state.isLoaded) {
            this.getLocation(this.props.address,
                (location: google.maps.LatLng) => this.setLocation(location.lat(), location.lng()));
        }
    }

    private createMaker() {
        return createElement(Marker, {
            position: {
                lat: this.state.location.lat,
                lng: this.state.location.lng
            }
        });
    }

    private getLocation(address: string, callback: Function) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                callback(results[0].geometry.location);
            } else {
                mx.ui.error(`Can not find address ${this.props.address}`);
                this.setLocation(this.defaultLocation.lat, this.defaultLocation.lng);
            }
        });
    }

    private setLocation(lat: number, lng: number) {
        this.setState({
            isLoaded: true,
            location: { lat, lng }
        });
    }
}
