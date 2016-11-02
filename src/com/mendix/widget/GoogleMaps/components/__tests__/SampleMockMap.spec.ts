import { shallow } from "enzyme";
import { createElement } from "react";

import { Map, MapProps } from "../Map";

import { EventMock, GeocoderLocationType, GeocoderMock, GeocoderStatus, LatLngBoundsMock,
    LatLngMock, MapsMock, MarkerMock } from "../../../../../../../tests/mocks/GoogleMaps";

describe("Sample mock Map", () => {

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

    it("should geocode an address", () => {
        spyOn(window.google.maps.Geocoder.prototype, "geocode");
        const renderMap = (props: MapProps) => shallow(createElement(Map, props));

        const output = renderMap({ address });
        let maps = output.instance();
        maps.setState({ isLoaded: true });

        expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
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
