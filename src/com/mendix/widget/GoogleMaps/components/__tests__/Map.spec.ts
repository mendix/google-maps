import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Map, MapProps } from "../Map";

import { EventMock, GeocoderLocationType, GeocoderMock, GeocoderStatus, LatLngBoundsMock,
    LatLngMock, MapsMock, MarkerMock } from "../../../../../../../tests/mocks/GoogleMaps";

describe("Map", () => {

    window.google = window.google || {};
    window.google.maps = window.google.maps || {};
    window.google.event = window.google.event || {};
    const originalMap = window.google.maps.Map;
    const originalGeocoder = window.google.maps.Geocoder;
    const originalLatLngBounds = window.google.maps.LatLngBounds;
    const originalLatLng = window.google.maps.LatLng;
    const originalMarker = window.google.maps.Marker;
    const originalEvent = window.google.maps.event;

    const address = "Lumumba Ave, Kampala, Uganda";
    const renderMap = (props: MapProps) => shallow(createElement(Map, props));
    const output = renderMap({ address });

    beforeEach(() => {
        window.google.maps.Geocoder = GeocoderMock;
        window.google.maps.Map = MapsMock;
        window.google.maps.LatLngBounds = LatLngBoundsMock;
        window.google.maps.LatLng = LatLngMock;
        window.google.maps.Marker = MarkerMock;
        window.google.maps.event = EventMock;
        window.google.maps.GeocoderStatus = GeocoderStatus;
        window.google.maps.GeocoderStatus = GeocoderLocationType;
    });

    it("should render with the map structure", () => {
         expect(output).toMatchStructure(
            DOM.div({ })
          );
    });

    it("renders with classes", () => {
        expect(output).toHaveClass("mx-google-maps");
    });

    it("should load the google maps script with API key", () => {
        //
    });

    it("should load the google maps script without API key", () => {
        //
    });

    it("should add a resize listener", () => {
        //
    });

    it("should center the map on resize", () => {
        //
    });

    it("should remove the resize listener", () => {
        //
    });

    describe("with no address", () => {
        it("should not look up the location", () => {
            //
        });

        it("should not display a marker", () => {
            //
        });

        it("should center to the default address", () => {
            //
        });
    });

    describe("with a valid address", () => {
        it("should lookup the location", () => {
            spyOn(window.google.maps.Geocoder.prototype, "geocode");

            let maps = output.instance();
            maps.setState({ isLoaded: true });

            expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
        });

        it("should render a marker", () => {
            //
        });

        it("should center to the location of the address", () => {
            //
        });

        it("should display the first marker if multiple locations are found", () => {
            // 
        });
    });

    describe("with an invalid address", () => {
        it("should fail to find a location", () => {
            //
        });

        it("should not render a marker", () => {
            //
        });

        it("should center to the default address", () => {
            //
        });

        it("should display an error", () => {
            //
        });
    });

    describe("when offline", () => {
        it("should show a user error on loading a map", () => {
            //
        });

        it("should show a user error when looking up an address", () => {
            //
        });
    });

    afterEach(() => {
        // Probably its good enough the reset fully.
        // window.google = undefined;
        window.google.maps.Map = originalMap;
        window.google.maps.Geocoder = originalGeocoder;
        window.google.maps.LatLngBounds = originalLatLngBounds;
        window.google.maps.LatLng = originalLatLng;
        window.google.maps.Marker = originalMarker;
        window.google.maps.event = originalEvent;
    });
});
