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
    const APIKey = "AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec";
    const renderMap = (props: MapProps) => shallow(createElement(Map, props));
    let mapDocument = renderMap({ address });
    let mapComponent = mapDocument.instance() as Map;

    beforeEach(() => {
        window.google.maps.Geocoder = GeocoderMock;
        window.google.maps.Map = MapsMock;
        window.google.maps.LatLngBounds = LatLngBoundsMock;
        window.google.maps.LatLng = LatLngMock;
        window.google.maps.Marker = MarkerMock;
        window.google.maps.event = EventMock;
        window.google.maps.GeocoderStatus = GeocoderStatus;
        window.google.maps.GeocoderLocationType = GeocoderLocationType;
    });

    it("should render with the map structure", () => {
        expect(mapDocument).toMatchStructure(
            DOM.div({ })
        );
    });

    it("renders with classes", () => {
        expect(mapDocument).toHaveClass("mx-google-maps");
    });

    it("should load the google maps script without API key", () => {
        mapComponent.setState({ isLoaded: false });
        mapComponent.componentDidMount();

        expect(document.body.innerHTML).not.toContain(APIKey);
        expect(google).toBeDefined();
    });

    it("should load the google maps script with API key", () => {
        mapDocument = renderMap({ address, apiKey: APIKey });
        mapComponent = mapDocument.instance() as Map;

        mapComponent.setState({ isLoaded: false });
        mapComponent.componentDidMount();

        expect(document.body.innerHTML).toContain(APIKey);
        expect(google).toBeDefined();
    });

    it("should add a resize listener", () => {
        spyOn(window.google.maps.event, "addDomListener");

        const output = renderMap({ address: "" });
        output.setState({ isLoaded: true });

        expect(window.google.maps.event.addDomListener).toHaveBeenCalledTimes(1);
    });

    it("should center the map on resize", () => {
        spyOn(window.google.maps.event, "trigger");
        spyOn(window.google.maps.Map.prototype, "setCenter");

        const output = renderMap({ address });
        output.setState({ isLoaded: true });
        window.google.maps.event.trigger(window, "resize");

        expect(window.google.maps.event.trigger).toHaveBeenCalledTimes(1);
        expect(window.google.maps.Map.prototype.setCenter).toHaveBeenCalled();
    });

    it("should remove the resize listener", () => {
        spyOn(window.google.maps.event, "clearListeners");

        const output = renderMap({ address: "" });
        output.unmount();

        expect(window.google.maps.event.clearListeners).toHaveBeenCalledTimes(1);
    });

    describe("with no address", () => {
        it("should not look up the location", () => {
            //
        });

        it("should not display a marker", () => {
            spyOn(window.google.maps, "Marker");

            const output = renderMap({ address: undefined });
            output.setState({ isLoaded: true });

            expect(window.google.maps.Marker).not.toHaveBeenCalled();
        });

        it("should center to the default address", () => {
            spyOn(window.google.maps.Map.prototype, "setCenter");

            mapComponent.setState({ isLoaded: true });

            expect(window.google.maps.Map.prototype.setCenter).toHaveBeenCalled();
        });
    });

    describe("with a valid address", () => {
        it("should lookup the location", () => {
            spyOn(window.google.maps.Geocoder.prototype, "geocode");

            mapComponent.setState({ isLoaded: true });

            expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
        });

        it("should render a marker", () => {
            spyOn(window.google.maps, "Marker");

            mapComponent.setState({ isLoaded: true });

            expect(window.google.maps.Marker).toHaveBeenCalled();
        });

        it("should center to the location of the address", () => {
            spyOn(window.google.maps.Map.prototype, "setCenter");

            mapComponent.setState({ isLoaded: true });

            expect(mapComponent.props.address).toBe("Lumumba Ave, Kampala, Uganda");
            expect(window.google.maps.Map.prototype.setCenter).toHaveBeenCalled();
        });

        it("should display the first marker if multiple locations are found", () => {
            // 
        });
    });

    describe("with an invalid address", () => {
        it("should fail to find a location", () => {
            spyOn(window.google.maps.Geocoder.prototype, "geocode").and.callThrough();

            const output = renderMap({ address: "" });
            output.setState({ isLoaded: true });

            expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalledTimes(2);
        });

        it("should not render a marker", () => {
            spyOn(window.google.maps, "Marker");

            const output = renderMap({ address: "" });
            output.setState({ isLoaded: true });

            expect(window.google.maps.Marker).not.toHaveBeenCalled();
        });

        it("should center to the default address", () => {
            spyOn(window.google.maps.Map.prototype, "setCenter");

            mapComponent.setState({ isLoaded: true });

            expect(window.google.maps.Map.prototype.setCenter).toHaveBeenCalled();
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
