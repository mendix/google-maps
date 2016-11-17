import { shallow } from "enzyme";
import * as _ from "lodash";
import { DOM, createElement } from "react";
import { GoogleMap, GoogleMapProps, LatLng, Marker, withGoogleMap } from "react-google-maps";

import { Map, MapProps } from "../Map";

import { EventMock, GeocoderLocationType, GeocoderMock, GeocoderStatus, LatLngBoundsMock,
    LatLngMock, MapsMock, MarkerMock } from "../../../../../../../tests/mocks/GoogleMaps";

import { MxUiMock } from "../../../../../../../tests/mocks/Mendix";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";

describe("Map", () => {
    const address = "Lumumba Ave, Kampala, Uganda";
    const APIKey = "AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec";
    const renderMap = (props: MapProps) => shallow(createElement(Map, props));
    const defaultCenterLocation = { lat: 51.9107963, lng: 4.4789878 };

    const MxGoogleMap = _.flowRight(withScriptjs, withGoogleMap)((googleMapProps: GoogleMapProps) => (
        createElement(GoogleMap, {
            center: googleMapProps.center,
            defaultZoom: 14,
            ref: googleMapProps.onMapLoad
        }, googleMapProps.marker)
    ));

    beforeAll(() => {
        window.google = window.google || {};
        window.google.maps = window.google.maps || {};
        window.google.event = window.google.event || {};
        window.google.maps.Geocoder = GeocoderMock;
        window.google.maps.Map = MapsMock;
        window.google.maps.LatLngBounds = LatLngBoundsMock;
        window.google.maps.LatLng = LatLngMock;
        window.google.maps.Marker = MarkerMock;
        window.google.maps.event = EventMock;
        window.google.maps.GeocoderStatus = GeocoderStatus;
        window.google.maps.GeocoderLocationType = GeocoderLocationType;
        window.mx = window.mx || {};
        window.mx.ui = MxUiMock.prototype;
    });

    describe("when online", () => {
        it("should render with the map structure", () => {
            const map = renderMap({ address });
            expect(map).toMatchStructure(
                    createElement(MxGoogleMap, {
                    center: defaultCenterLocation,
                    containerElement: DOM.div({ className: "mx-google-map-container" }),
                    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${undefined}`,
                    loadingElement: DOM.div({ className: "mx-google-maps-loading" }, "Loading map"),
                    mapElement: DOM.div({ className: "mx-google-maps" }),
                    marker: null
                })
            );
        });

        it("renders with classes", () => {
            const googleMap = renderMap({ address }).first();

            expect(googleMap.prop("containerElement").props.className).toBe("mx-google-map-container");
            expect(googleMap.prop("loadingElement").props.className).toBe("mx-google-maps-loading");
            expect(googleMap.prop("mapElement").props.className).toBe("mx-google-maps");
        });

        xit("should add a resize listener", () => {
            spyOn(window.google.maps.event, "addDomListener");

            const map = renderMap({ address: "" });
            map.setState({ isLoaded: true });

            expect(window.google.maps.event.addDomListener).toHaveBeenCalled();
        });

        xit("should center the map on resize", () => {
            spyOn(window.google.maps.event, "trigger");
            spyOn(window.google.maps.Map.prototype, "setCenter");

            const map = renderMap({ address });
            map.setState({ isLoaded: true });
            window.google.maps.event.trigger(window, "resize");

            expect(window.google.maps.event.trigger).toHaveBeenCalled();
            expect(window.google.maps.Map.prototype.setCenter).toHaveBeenCalled();
        });

        xit("should remove the resize listener", () => {
            spyOn(window.google.maps.event, "clearListeners");

            const map = renderMap({ address }).instance() as Map;
            map.componentDidMount();
            map.componentWillUnmount();

            expect(window.google.maps.event.clearListeners).toHaveBeenCalled();
        });

        describe("with no address", () => {
            it("should not look up the location", () => {
                spyOn(window.google.maps.Geocoder.prototype, "geocode").and.callThrough();

                const output = renderMap({ address: "" });
                const map = output.instance() as Map;

                map.componentWillReceiveProps({ address: undefined });

                expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
            });

            it("should not display a marker", () => {
                spyOn(window.google.maps, "Marker");

                const output = renderMap({ address: "" });
                const map = output.instance() as Map;

                map.componentWillReceiveProps({ address: undefined });

                expect(window.google.maps.Marker).not.toHaveBeenCalled();
            });

            it("should center to the default address", () => {
                const googleMap = renderMap({ address }).first();

                expect(googleMap.prop("center").lat).toBe(defaultCenterLocation.lat);
                expect(googleMap.prop("center").lng).toBe(defaultCenterLocation.lng);
            });
        });

        describe("with a valid address", () => {
            it("should lookup the location", () => {
                spyOn(window.google.maps.Geocoder.prototype, "geocode");

                const output = renderMap({ address: "" });
                const map = output.instance() as Map;

                map.componentWillReceiveProps({ address });

                expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
            });

            xit("should render a marker", () => {
                spyOn(window.google.maps, "Marker");

                const map = renderMap({ address });
                map.setState({ isLoaded: true });

                expect(window.google.maps.Marker).toHaveBeenCalled();
            });

            xit("should center to the location of the address", () => {
                spyOn(window.google.maps.Map.prototype, "setCenter");

                const map = renderMap({ address }).instance() as Map;
                map.setState({ isLoaded: true });

                expect(map.props.address).toBe("Lumumba Ave, Kampala, Uganda");
                expect(window.google.maps.Map.prototype.setCenter).toHaveBeenCalled();
            });

            xit("should display the first marker if multiple locations are found", () => {
                spyOn(window.google.maps, "Marker");
                spyOn(window.google.maps.Geocoder.prototype, "geocode").and.callThrough();

                const mapDiv = document.createElement("div");
                const map = renderMap({ address: "multipleAddress" });
                map.setState({ isLoaded: true });

                expect(window.google.maps.Marker.calls.argsFor(0)).toEqual(
                    [ Object({ map: new MapsMock(mapDiv), position: new LatLngMock(34.213171, -118.571022) }) ]
                );
                expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
            });
        });

        describe("with an invalid address", () => {
            it("should fail to find a location", () => {
                spyOn(window.google.maps.Geocoder.prototype, "geocode").and.callThrough();

                const output = renderMap({ address });
                const map = output.instance() as Map;

                map.componentWillReceiveProps({ address: "" });

                expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
            });

            xit("should not render a marker", () => {
                spyOn(window.google.maps, "Marker");

                const map = renderMap({ address: "" });
                map.setState({ isLoaded: true });

                expect(window.google.maps.Marker).not.toHaveBeenCalled();
            });

            it("should center to the default address", () => {
                const googleMap = renderMap({ address: "" }).first();

                expect(googleMap.prop("center").lat).toBe(defaultCenterLocation.lat);
                expect(googleMap.prop("center").lng).toBe(defaultCenterLocation.lng);
            });

            it("should display an error", () => {
                spyOn(window.mx.ui, "error").and.callThrough();

                const invalidAddress = "";
                const output = renderMap({ address });
                const map = output.instance() as Map;

                map.componentWillReceiveProps({ address: invalidAddress });

                expect(window.mx.ui.error).toHaveBeenCalled();
            });
        });

        afterAll(() => {
            // Probably its good enough the reset fully.
            // window.google = undefined;
            window.google.maps.Map = MapsMock;
            window.google.maps.Geocoder = GeocoderMock;
            window.google.maps.LatLngBounds = LatLngBoundsMock;
            window.google.maps.LatLng = LatLngMock;
            window.google.maps.Marker = MarkerMock;
            window.google.maps.event = EventMock;
        });
    });

    describe("on loading", () => {
        it("should load the google maps script without API key", () => {
            window.google.maps.Map = undefined;
            const output = renderMap({ address: undefined });
            const map = output.instance() as Map;

            map.componentWillReceiveProps({ address });

            expect(document.body.innerHTML).not.toContain(APIKey);
            expect(google).toBeDefined();
        });

        it("should load the google maps script with API key", () => {
            window.google.maps.Map = undefined;
            const googleMap = renderMap({ address, apiKey: APIKey }).first();

            expect(googleMap.prop("googleMapURL")).toContain(APIKey);
            expect(google).toBeDefined();
        });
    });

    describe("when offline", () => {
        xit("should show a user error on loading a map", () => {
           //
        });

        xit("should show a user error when looking up an address", () => {
            //
        });
    });

});
