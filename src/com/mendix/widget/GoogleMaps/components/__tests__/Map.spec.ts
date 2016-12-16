import { ShallowWrapper, shallow } from "enzyme";
import GoogleMap from "google-map-react";
import { DOM, createElement } from "react";

import { Map, MapProps, MapState } from "../Map";
import { Marker } from "../Marker";

import { mockGoogleMaps } from "tests/mocks/GoogleMaps";
import { mockMendix } from "tests/mocks/Mendix";

describe("Map", () => {
    const address = "Lumumba Ave, Kampala, Uganda";
    const invalidAddress = "invalidAddress";
    const APIKey = "AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec";
    const renderMap = (props: MapProps) => shallow(createElement(Map, props));
    const defaultCenterLocation = { lat: 51.9107963, lng: 4.4789878 };
    const successMockLocation = { lat: 30, lng: 118 };
    const multipleAddressMockLocation = { lat: 34.213171, lng: -118.571022 };

    const setUpMap = (addressParam: string, APIKeyParam?: string): ShallowWrapper<MapProps, MapState> => {
        const output = renderMap({ address: addressParam, apiKey: APIKeyParam });
        mockGoogleMaps.setup();
        output.find(GoogleMap).prop("onGoogleApiLoaded").apply();
        return output;
    };

    beforeAll(() => {
        window.google = mockGoogleMaps;
        window.mx = mockMendix;
    });

    it("should render with the map structure", () => {
        const map = renderMap({ address });
        expect(map).toBeElement(
            DOM.div({ className: "widget-google-maps" },
                createElement(GoogleMap, {
                    bootstrapURLKeys: { key: undefined },
                    center: defaultCenterLocation,
                    defaultZoom: 14,
                    onGoogleApiLoaded: jasmine.any(Function) as any,
                    resetBoundsOnResize: true,
                    yesIWantToUseGoogleMapApiInternals: true
                })
            )
        );
    });

    describe("with no address", () => {
        it("should not look up the location", () => {
            setUpMap("");
            spyOn(window.google.maps.Geocoder.prototype, "geocode").and.callThrough();

            expect(window.google.maps.Geocoder.prototype.geocode).not.toHaveBeenCalled();
        });

        it("should not display a marker", () => {
            const output = setUpMap("");

            const marker = output.find(Marker);
            expect(marker.length).toBe(0);
        });

        it("should center to the default address", () => {
            const googleMap = renderMap({ address }).find(GoogleMap);

            expect(googleMap.prop("center").lat).toBe(defaultCenterLocation.lat);
            expect(googleMap.prop("center").lng).toBe(defaultCenterLocation.lng);
        });
    });

    describe("with a valid address", () => {
        it("should lookup the location", () => {
            spyOn(window.google.maps.Geocoder.prototype, "geocode");

            setUpMap(address);

            expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
        });

        it("should render a marker", () => {
            const output = setUpMap(address);

            const marker = output.find(Marker);
            expect(marker.length).toBe(1);
            expect(marker.prop("lat")).toBe(successMockLocation.lat);
            expect(marker.prop("lng")).toBe(successMockLocation.lng);
        });

        it("should center to the location of the address", () => {
            const output = setUpMap(address);
            const mapComponent = output.instance() as Map;

            expect(mapComponent.state.location.lat).toBe(successMockLocation.lat);
            expect(mapComponent.state.location.lng).toBe(successMockLocation.lng);
        });

        it("should display the first marker if multiple locations are found", () => {
            const output = setUpMap("multipleAddress" );

            const marker = output.find(Marker);

            expect(marker.prop("lat")).toBe(multipleAddressMockLocation.lat);
            expect(marker.prop("lng")).toBe(multipleAddressMockLocation.lng);
        });
    });

    describe("with an invalid address", () => {
        it("should not render a marker", () => {
            const output = setUpMap(invalidAddress);

            const marker = output.find(Marker);
            expect(marker.length).toBe(0);
        });

        it("should center to the default address", () => {
            const output = setUpMap(invalidAddress);

            const marker = output.childAt(0);
            expect(marker.prop("center").lat).toBe(defaultCenterLocation.lat);
            expect(marker.prop("center").lng).toBe(defaultCenterLocation.lng);
        });

        it("should display an error", () => {
            spyOn(window.mx.ui, "error").and.callThrough();

            setUpMap(invalidAddress);

            expect(window.mx.ui.error).toHaveBeenCalled();
        });
    });

    describe("on loading", () => {
        it("if no key is configured", () => {
            const googleMap = renderMap({ address, apiKey: undefined }).find(GoogleMap);

            expect(googleMap.prop("bootstrapURLKeys").key).not.toContain(APIKey);
        });

        it("when key is configured", () => {
            const googleMap = renderMap({ address, apiKey: APIKey }).find(GoogleMap);

            expect(googleMap.prop("bootstrapURLKeys").key).toContain(APIKey);
        });
    });

    describe("with updated the address", () => {
        it("should change marker location to new address", () => {
            const output = setUpMap(address);

            const marker = output.find(Marker).at(0);
            expect(marker.prop("lat")).toBe(successMockLocation.lat);
            expect(marker.prop("lng")).toBe(successMockLocation.lng);

            output.setProps({ address: "multipleAddress" });

            const markerNew = output.find(Marker).at(0);
            expect(markerNew.prop("lat")).toBe(multipleAddressMockLocation.lat);
            expect(markerNew.prop("lng")).toBe(multipleAddressMockLocation.lng);
        });

        it("should not lookup the location if address is not changed", () => {
            const output = setUpMap(address);

            spyOn(window.google.maps.Geocoder.prototype, "geocode");

            output.setProps({ address });

            expect(window.google.maps.Geocoder.prototype.geocode).not.toHaveBeenCalled();
        });

    });

    afterAll(() => {
        window.mx = undefined;
        window.google = undefined;
    });
});
