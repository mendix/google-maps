import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Map, MapProps } from "../Map";

import { EventMock, GeocoderLocationType, GeocoderMock, GeocoderStatus, LatLngBoundsMock,
    LatLngMock, MapsMock, MarkerMock } from "../../../../../../../tests/mocks/GoogleMaps";

describe("Map", () => {
    const address = "Lumumba Ave, Kampala, Uganda";
    const APIKey = "AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec";
    const renderMap = (props: MapProps) => shallow(createElement(Map, props));

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
    });

    it("should render with the map structure", () => {
        const map = renderMap({ address });
        expect(map).toMatchStructure(
            DOM.div({})
        );
    });

    it("renders with classes", () => {
        const map = renderMap({ address });
        expect(map).toHaveClass("mx-google-maps");
    });

    it("should load the google maps script without API key", () => {
        const map = renderMap({ address }).instance() as Map;
        map.setState({ isLoaded: false });
        map.componentDidMount();

        expect(document.body.innerHTML).not.toContain(APIKey);
        expect(google).toBeDefined();
    });

    it("should load the google maps script with API key", () => {
        const map = renderMap({ address, apiKey: APIKey }).instance() as Map;
        map.setState({ isLoaded: false });
        map.componentDidMount();

        expect(document.body.innerHTML).toContain(APIKey);
        expect(google).toBeDefined();
    });

    it("should add a resize listener", () => {
        spyOn(window.google.maps.event, "addDomListener");

        const map = renderMap({ address: "" });
        map.setState({ isLoaded: true });

        expect(window.google.maps.event.addDomListener).toHaveBeenCalled();
    });

    it("should center the map on resize", () => {
        spyOn(window.google.maps.event, "trigger");
        spyOn(window.google.maps.Map.prototype, "setCenter");

        const map = renderMap({ address });
        map.setState({ isLoaded: true });
        window.google.maps.event.trigger(window, "resize");

        expect(window.google.maps.event.trigger).toHaveBeenCalled();
        expect(window.google.maps.Map.prototype.setCenter).toHaveBeenCalled();
    });

    it("should remove the resize listener", () => {
        spyOn(window.google.maps.event, "clearListeners");

        const map = renderMap({ address: "" });
        map.unmount();

        expect(window.google.maps.event.clearListeners).toHaveBeenCalled();
    });

    describe("with no address", () => {
        it("should not look up the location", () => {
            spyOn(window.google.maps.Geocoder.prototype, "geocode").and.callThrough();

            const map = renderMap({ address: undefined });
            map.setState({ isLoaded: true });

            expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalledTimes(2);
        });

        it("should not display a marker", () => {
            spyOn(window.google.maps, "Marker");

            const map = renderMap({ address: undefined });
            map.setState({ isLoaded: true });

            expect(window.google.maps.Marker).not.toHaveBeenCalled();
        });

        it("should center to the default address", () => {
            spyOn(window.google.maps.Map.prototype, "setCenter");

            const map = renderMap({ address });
            map.setState({ isLoaded: true });

            expect(window.google.maps.Map.prototype.setCenter).toHaveBeenCalled();
        });
    });

    describe("with a valid address", () => {
        it("should lookup the location", () => {
            spyOn(window.google.maps.Geocoder.prototype, "geocode");

            const map = renderMap({ address });
            map.setState({ isLoaded: true });

            expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalled();
        });

        it("should render a marker", () => {
            spyOn(window.google.maps, "Marker");

            const map = renderMap({ address });
            map.setState({ isLoaded: true });

            expect(window.google.maps.Marker).toHaveBeenCalled();
        });

        it("should center to the location of the address", () => {
            spyOn(window.google.maps.Map.prototype, "setCenter");

            const map = renderMap({ address }).instance() as Map;
            map.setState({ isLoaded: true });

            expect(map.props.address).toBe("Lumumba Ave, Kampala, Uganda");
            expect(window.google.maps.Map.prototype.setCenter).toHaveBeenCalled();
        });

        it("should display the first marker if multiple locations are found", () => {
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

            const map = renderMap({ address: "" });
            map.setState({ isLoaded: true });

            expect(window.google.maps.Geocoder.prototype.geocode).toHaveBeenCalledTimes(2);
        });

        it("should not render a marker", () => {
            spyOn(window.google.maps, "Marker");

            const map = renderMap({ address: "" });
            map.setState({ isLoaded: true });

            expect(window.google.maps.Marker).not.toHaveBeenCalled();
        });

        it("should center to the default address", () => {
            spyOn(window.google.maps.Map.prototype, "setCenter");

            const map = renderMap({ address });
            map.setState({ isLoaded: true });

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
