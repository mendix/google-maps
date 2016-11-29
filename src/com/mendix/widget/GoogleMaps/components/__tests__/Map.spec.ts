import { shallow } from "enzyme";
import GoogleMap from "google-map-react";
import { DOM, createElement } from "react";

import { Map, MapProps } from "../Map";

import { EventMock, GeocoderLocationType, GeocoderMock, GeocoderStatus, LatLngBoundsMock,
    LatLngMock, MapsMock, MarkerMock, MockGoogle } from "../../../../../../../tests/mocks/GoogleMaps";

import { MxMock, MxUiMock } from "../../../../../../../tests/mocks/Mendix";
describe("Map", () => {
    const address = "Lumumba Ave, Kampala, Uganda";
    const invalidAddress = "invalidAddress";
    const APIKey = "AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec";
    const renderMap = (props: MapProps) => shallow(createElement(Map, props));
    const defaultCenterLocation = { lat: 51.9107963, lng: 4.4789878 };
    const successMockLocation = { lat: 30, lng: 118 };
    const multipleAddressMockLocation = { lat: 34.213171, lng: -118.571022 };

    beforeAll(() => {
        window.google = MockGoogle;
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
        window.mx = MxMock;
        window.mx.ui = MxUiMock.prototype;
    });

    describe("when online", () => {
        it("should render with the map structure", () => {
            const map = renderMap({ address });
            expect(map).toBeElement(
                DOM.div({ className: "mx-google-maps" },
                    createElement(GoogleMap, {
                        bootstrapURLKeys: { key: undefined },
                        center: defaultCenterLocation,
                        defaultZoom: 14,
                        onGoogleApiLoaded: jasmine.any(Function) as any,
                        resetBoundsOnResize: true
                    })
                )
            );
        });

        it("renders with classes", () => {
            const googleMap = renderMap({ address });

            expect(googleMap.hasClass("mx-google-maps"));
        });

        describe("with no address", () => {
            it("should not look up the location", () => {
                spyOn(window.google.maps.Geocoder.prototype, "geocode").and.callThrough();
                const output = renderMap({ address: "" });

                const mapComponent = output.instance() as Map;
                mapComponent.componentDidMount();

                expect(window.google.maps.Geocoder.prototype.geocode).not.toHaveBeenCalled();
            });

            it("should not display a marker", () => {
                const output = renderMap({ address: "" });

                const mapComponent = output.instance() as Map;
                mapComponent.componentDidMount();

                const marker = output.find(".mx-google-maps-marker");
                expect(marker.length).toBe(0);
            });

            it("should center to the default address", () => {
                const googleMap = renderMap({ address }).childAt(0);

                expect(googleMap.prop("center").lat).toBe(defaultCenterLocation.lat);
                expect(googleMap.prop("center").lng).toBe(defaultCenterLocation.lng);
            });
        });

        describe("with a valid address", () => {
            it("should lookup the location", () => {
                spyOn(window.google.maps.Geocoder.prototype, "geocode");
                const output = renderMap({ address: "" });
                const map = output.instance() as Map;
                const googleMap = output.childAt(0);

                map.componentWillReceiveProps({ address });
                googleMap.props().onGoogleApiLoaded();

                expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
            });

            it("should render a marker", () => {
                const output = renderMap({ address });

                const mapComponent = output.instance() as Map;
                mapComponent.componentDidMount();

                const marker = output.find(".mx-google-maps-marker");
                expect(marker.length).toBe(1);
                // TODO check marker props location is correct?
            });

            it("should center to the location of the address", () => {
                const output = renderMap({ address });

                const mapComponent = output.instance() as Map;
                mapComponent.componentDidMount();

                expect(mapComponent.state.location.lat).toBe(successMockLocation.lat);
                expect(mapComponent.state.location.lng).toBe(successMockLocation.lng);
            });

            it("should display the first marker if multiple locations are found", () => {
                const output = renderMap({ address: "multipleAddress" });

                const mapComponent = output.instance() as Map;
                mapComponent.componentDidMount();

                const marker = output.find(".mx-google-maps-marker");
                expect(marker.prop("lat")).toBe(multipleAddressMockLocation.lat);
                expect(marker.prop("lng")).toBe(multipleAddressMockLocation.lng);
            });
        });

        describe("update the address", () => {
            it("with new location", () => {
                const output = renderMap({ address });

                const mapComponent = output.instance() as Map;
                mapComponent.componentDidMount();

                const marker = output.find(".mx-google-maps-marker").at(0);
                expect(marker.prop("lat")).toBe(successMockLocation.lat);
                expect(marker.prop("lng")).toBe(successMockLocation.lng);

                const map = output.instance() as Map;
                map.componentWillReceiveProps({ address: "multipleAddress" });

                const markerNew = output.find(".mx-google-maps-marker").at(0);
                expect(markerNew.prop("lat")).toBe(multipleAddressMockLocation.lat);
                expect(markerNew.prop("lng")).toBe(multipleAddressMockLocation.lng);
            });
        });

        describe("with an invalid address", () => {
            it("should not render a marker", () => {
                const output = renderMap({ address: invalidAddress });

                const mapComponent = output.instance() as Map;
                mapComponent.componentDidMount();

                const marker = output.find(".mx-google-maps-marker");
                expect(marker.length).toBe(0);
            });

            it("should center to the default address", () => {
                const googleMap = renderMap({ address: invalidAddress });
                const mapComponent = googleMap.instance() as Map;
                mapComponent.componentDidMount();
                const marker = googleMap.childAt(0);

                expect(marker.prop("center").lat).toBe(defaultCenterLocation.lat);
                expect(marker.prop("center").lng).toBe(defaultCenterLocation.lng);
            });

            it("should display an error", () => {
                spyOn(window.mx.ui, "error").and.callThrough();
                const output = renderMap({ address: invalidAddress });
                const mapComponent = output.instance() as Map;
                mapComponent.componentDidMount();

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
            const googleMap = renderMap({ address, apiKey: undefined }).childAt(0);

            expect(googleMap.prop("bootstrapURLKeys").key).not.toContain(APIKey);
            expect(google).toBeDefined();
        });

        it("should load the google maps script with API key", () => {
            window.google.maps.Map = undefined; // OR window.google = undefined;
            const googleMap = renderMap({ address, apiKey: APIKey }).childAt(0);

            expect(googleMap.prop("bootstrapURLKeys").key).toContain(APIKey);
            expect(google).toBeDefined();
        });
    });

});
