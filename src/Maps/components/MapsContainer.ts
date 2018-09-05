import { Component, createElement } from "react";
import { LeafletEvent } from "leaflet";

import { LeafletMap } from "./LeafletMap";
import googleApiWrapper from "./GoogleMap";
import { Container } from "../utils/namespace";
import { fetchData, fetchMarkerObjectUrl, parseStaticLocations } from "../utils/Data";
import { validLocations, validateLocationProps } from "../utils/Validations";
import MapsContainerProps = Container.MapsContainerProps;
import MapProps = Container.MapProps;
import Location = Container.Location;
import DataSourceLocationProps = Container.DataSourceLocationProps;

// tslint:disable-next-line:no-submodule-imports
import "leaflet/dist/leaflet.css";
// Re-uses images from ~leaflet package
// Use workaround for marker icon, that is not standard compatible with webpack
// https://github.com/ghybs/leaflet-defaulticon-compatibility#readme
import "leaflet-defaulticon-compatibility";
// tslint:disable-next-line:no-submodule-imports
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "../../ui/Maps.css";

export interface MapsContainerState {
    alertMessage?: string;
    locations: Location[];
    isFetchingData?: boolean;
}

export default class MapsContainer extends Component<MapsContainerProps, MapsContainerState> {
    private subscriptionHandles: number[] = [];
    readonly state: MapsContainerState = {
        alertMessage: "",
        locations: [],
        isFetchingData: false
    };

    render() {
        const mapsApiToken = this.props.apiToken ? this.props.apiToken.replace(/ /g, "") : undefined;
        const commonProps = {
            allLocations: this.state.locations,
            fetchingData: this.state.isFetchingData,
            className: this.props.class,
            alertMessage: this.state.alertMessage,
            divStyles: parseStyle(this.props.style),
            onClickMarker: this.onClickMarker,
            mapsToken: mapsApiToken,
            ...this.props as MapProps
        };

        if (this.props.mapProvider === "googleMaps") {
            return createElement(googleApiWrapper, {
                ...commonProps
            });
        } else {
            return createElement(LeafletMap, {
                ...commonProps
            });
        }
    }

    componentWillReceiveProps(nextProps: MapsContainerProps) {
        this.resetSubscriptions(nextProps.mxObject);
        const validationMessage = validateLocationProps(nextProps);
        if (nextProps && nextProps.mxObject) {
            if (validationMessage) {
                this.setState({ alertMessage: validationMessage });
            } else {
                this.fetchData(nextProps.mxObject);
            }
        } else {
            this.setState({ locations: [], alertMessage: "", isFetchingData: false });
        }
    }

    componentWillUnmount() {
        this.unsubscribeAll();
    }

    private resetSubscriptions(contextObject?: mendix.lib.MxObject) {
        this.unsubscribeAll();
        if (this.props.locations && this.props.locations.length) {
            if (contextObject) {
                this.subscriptionHandles.push(window.mx.data.subscribe({
                    guid: contextObject.getGuid(),
                    callback: () => this.fetchData(contextObject)
                }));
                this.props.locations.forEach(location => {
                    this.subscriptionHandles.push(window.mx.data.subscribe({
                        entity: location.locationsEntity as string,
                        callback: () => this.fetchData(contextObject)
                    }));
                    [
                        location.latitudeAttribute,
                        location.longitudeAttribute,
                        location.staticMarkerIcon
                    ]
                    .forEach(
                        (attr): number => this.subscriptionHandles.push(window.mx.data.subscribe({
                            attr,
                            callback: () => this.fetchData(contextObject),
                            guid: contextObject.getGuid()
                        }))
                    );
                });
            }
        }
    }

    private unsubscribeAll() {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
        this.subscriptionHandles = [];
    }

    private fetchData = (contextObject?: mendix.lib.MxObject) => {
        this.setState({ isFetchingData: true });
        Promise.all(this.props.locations.map(locationAttr =>
            this.retrieveData(locationAttr, contextObject)
        ))
        .then(locations => {
            const locs = ([] as Location[]).concat(...locations);
            if (validLocations(locs)) {
                this.setState({
                    locations: locs,
                    isFetchingData: false,
                    alertMessage: ""
                });
            } else {
                throw new Error("Invalid Coordinates passed");
            }
        })
        .catch(reason => {
            this.setState({
                locations: [],
                alertMessage: `Failed due to ${reason.message}`,
                isFetchingData: false
            });
        });
    }

    private retrieveData = (locationOptions: DataSourceLocationProps, contextObject?: mendix.lib.MxObject): Promise<Location[]> =>
        new Promise((resolve, reject) => {
            if (contextObject) {
                const guid = contextObject.getGuid();
                if (locationOptions.dataSourceType === "static") {
                    const staticLocation = parseStaticLocations([ locationOptions ]);
                    resolve(staticLocation);
                } else if (locationOptions.dataSourceType === "context") {
                    this.setLocationsFromMxObjects([ contextObject ], locationOptions)
                        .then(locations => resolve(locations));
                } else {
                    fetchData({
                        guid,
                        type: locationOptions.dataSourceType,
                        entity: locationOptions.locationsEntity,
                        constraint: locationOptions.entityConstraint,
                        microflow: locationOptions.dataSourceMicroflow
                    })
                    .then(mxObjects => this.setLocationsFromMxObjects(mxObjects, locationOptions))
                    .then(locations => resolve(locations));
                }
            } else {
                reject("Context Object required");
            }
        })

    private setLocationsFromMxObjects = (mxObjects: mendix.lib.MxObject[], locationAttr: DataSourceLocationProps): Promise<Location[]> =>
        Promise.all(mxObjects.map(mxObject =>
            fetchMarkerObjectUrl({ type: locationAttr.markerImage, markerIcon: locationAttr.staticMarkerIcon }, mxObject)
                .then(markerUrl => {
                    return {
                        latitude: Number(mxObject.get(locationAttr.latitudeAttribute as string)),
                        longitude: Number(mxObject.get(locationAttr.longitudeAttribute as string)),
                        mxObject,
                        url: markerUrl,
                        locationAttr
                    };
                })
            ))

    private onClickMarker = (event: LeafletEvent & google.maps.MouseEvent, locationAttr: DataSourceLocationProps) => {
        const { locations } = this.state;
        const latitude = this.props.mapProvider === "googleMaps" ? event.latLng.lat() : event.target.getLatLng().lat;
        this.executeAction(locations[locations.findIndex(targetLoc => targetLoc.latitude === latitude)], locationAttr);
    }

    private executeAction = (markerLocation: Location, locationAttr: DataSourceLocationProps) => {
        const object = markerLocation.mxObject;

        if (object) {
            const { mxform } = this.props;
            const { onClickEvent, onClickMicroflow, onClickNanoflow, openPageAs, page } = locationAttr;
            const context = new mendix.lib.MxContext();
            context.setContext(object.getEntity(), object.getGuid());

            if (onClickEvent === "callMicroflow" && onClickMicroflow) {
                mx.ui.action(onClickMicroflow, {
                    context,
                    origin: mxform,
                    error: error =>
                        this.setState({
                            alertMessage: `Error while executing on click microflow ${onClickMicroflow} : ${error.message}`
                        })
                });
            } else if (onClickEvent === "callNanoflow" && onClickNanoflow.nanoflow) {
                window.mx.data.callNanoflow({
                    nanoflow: onClickNanoflow,
                    origin: mxform,
                    context,
                    error: error => this.setState({ alertMessage: `Error while executing on click nanoflow: ${error.message}` })
                });
            } else if (onClickEvent === "showPage" && page) {
                window.mx.ui.openForm(page, {
                    location: openPageAs,
                    context,
                    error: error => this.setState({ alertMessage: `Error while opening page ${page}: ${error.message}` })
                });
            } else if (onClickEvent !== "doNothing") {
                this.setState({ alertMessage: `No Action was passed ${onClickEvent}` });
            }
        }
    }
}

export const parseStyle = (style = ""): {[key: string]: string} => { // Doesn't support a few stuff.
    try {
        return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
            const pair = line.split(":");
            if (pair.length === 2) {
                const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                styleObject[name] = pair[1].trim();
            }

            return styleObject;
        }, {});
    } catch (error) {
        // tslint:disable-next-line no-console
        window.console.log("Failed to parse style", style, error);
    }

    return {};
};
