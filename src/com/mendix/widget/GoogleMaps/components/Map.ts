import * as _ from "lodash";
import { Component, DOM, Props, createElement } from "react";
import { GoogleMap, GoogleMapComponent, GoogleMapProps, LatLng, Marker, withGoogleMap } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";

export interface MapProps extends Props<Map> {
    apiKey?: string;
    address?: string;
}

interface MapState {
    isLoaded?: boolean;
    location?: LatLng;
}

const MxGoogleMap = _.flowRight(withScriptjs, withGoogleMap)((googleMapProps: GoogleMapProps) => (
    createElement(GoogleMap, {
        center: googleMapProps.center,
        defaultZoom: 14,
        onCenterChanged: googleMapProps.onCenterChanged,
        ref: googleMapProps.onMapLoad
    }, googleMapProps.marker)
));

export class Map extends Component<MapProps, MapState> {
    // Location of Mendix Netherlands office
    private defaultCenterLocation: LatLng = { lat: 51.9107963, lng: 4.4789878 };
    private reactGoogleMap: GoogleMapComponent;

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
            createElement(MxGoogleMap, {
                center: this.state.location ? this.state.location : this.defaultCenterLocation,
                containerElement: DOM.div({ className: "mx-google-map-container" }),
                googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}`,
                loadingElement: DOM.div({ className: "mx-google-maps-loading" }, "Loading map"),
                mapElement: DOM.div({ className: "mx-google-maps" }),
                marker: this.state.location ? this.createMaker(this.state.location) : null,
                onCenterChanged: () => this.handleCenterChanged(),
                onMapLoad: (map: any) => this.handleMapLoad(map),
                onResize: () => this.handleOnResize()
            })
        );
    }

    componentDidMount() {
        //
    }

    componentWillUnmount() {
        //
    }

    private handleMapLoad(map: any) {
        this.reactGoogleMap = map;
        if (this.props.address !== undefined && !this.state.isLoaded) {
            this.getLocation(this.props.address, (location: LatLng) =>
                this.setLocation(location));
        }
        google.maps.event.addDomListener(window, "resize", () => {
           //React google maps component has a bug
           //https://github.com/tomchentw/react-google-maps/issues/337
        });
    }
    private handleCenterChanged() {
        const nextCenter = this.reactGoogleMap.getCenter();
        this.setState({ location: { lat: nextCenter.lat(), lng: nextCenter.lng() } });
    }
     private handleOnResize() {
         console.log("on resize");
     }

    private getLocation(address: string, callback: Function) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                callback( {
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
        return createElement(Marker, {
            position: {
                lat: location.lat,
                lng: location.lng
            }
        });
    }
}
