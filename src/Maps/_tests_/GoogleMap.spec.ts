import { mount, shallow } from "enzyme";
import { createElement } from "react";

import { Alert } from "../../components/Alert";
import { GoogleMap, GoogleMapsProps } from "../components/GoogleMap";

import { mockGoogleMaps } from "../../../tests/mocks/GoogleMaps";

describe("Google maps", () => {
    const defaultProps: GoogleMapsProps = {
        autoZoom: true,
        defaultCenterLatitude: "",
        defaultCenterLongitude: "",
        height: 75,
        heightUnit: "pixels",
        scriptsLoaded: true,
        optionDrag: true,
        optionScroll: true,
        optionZoomControl: true,
        zoomLevel: 10,
        width: 50,
        widthUnit: "percentage",
        mapStyles: "",
        divStyles: {}
    };

    beforeAll(() => {
        window.google = mockGoogleMaps;
    });

    const renderGoogleMap = (props: GoogleMapsProps) => shallow(createElement(GoogleMap, props));
    const fullRenderGoogleMap = (props: GoogleMapsProps) => mount(createElement(GoogleMap, props));

    it("renders structure correctly", () => {
        const googleMaps = renderGoogleMap(defaultProps);
        const mapStyle = { width: "100px", height: "580px" };
        googleMaps.setProps({
            heightUnit: "percentageOfWidth",
            widthUnit: "pixels"
        });

        expect(googleMaps).toBeElement(
            createElement("div", {},
                createElement(Alert, { className: "widget-google-maps-alert" }),
                createElement("div", { className: "widget-google-maps-wrapper", style: mapStyle },
                    createElement("div", { className: "widget-google-maps" })
                )
            )
        );
    });

    it("renders structure correctly with pixels", () => {
        const googleMaps = renderGoogleMap(defaultProps);
        const mapStyle = { width: "100px", height: "580px" };
        googleMaps.setProps({
            heightUnit: "pixels",
            widthUnit: "pixels"
        });

        expect(googleMaps).toBeElement(
            createElement("div", {},
                createElement(Alert, { className: "widget-google-maps-alert" }),
                createElement("div", { className: "widget-google-maps-wrapper", style: mapStyle },
                    createElement("div", { className: "widget-google-maps" })
                )
            )
        );
    });

    it("renders the structure correctly with percentage units", () => {
        const googleMaps = renderGoogleMap(defaultProps);
        const mapStyle = { width: "100%", paddingBottom: "68%" };
        googleMaps.setProps({
            heightUnit: "percentageOfWidth",
            widthUnit: "percentage"
        });

        expect(googleMaps).toBeElement(
            createElement("div", {},
                createElement(Alert, { className: "widget-google-maps-alert" }),
                createElement("div", { className: "widget-google-maps-wrapper", style: mapStyle },
                    createElement("div", { className: "widget-google-maps" })
                )
            )
        );
    });

    it("renders the structure correctly with percentage of parent units", () => {
        const googleMaps = renderGoogleMap(defaultProps);
        const mapStyle = { width: "100%", height: "89%" };
        googleMaps.setProps({
            heightUnit: "percentageOfParent",
            widthUnit: "percentage"
        });

        expect(googleMaps).toBeElement(
            createElement("div", {},
                createElement(Alert, { className: "widget-google-maps-alert" }),
                createElement("div", { className: "widget-google-maps-wrapper", style: mapStyle },
                    createElement("div", { className: "widget-google-maps" })
                )
            )
        );
    });

    it("with default center Latitude and Longitude sets default center location based on them", () => {
        const googleMaps = fullRenderGoogleMap(defaultProps);
        googleMaps.setProps({
            defaultCenterLatitude: "39.90419989999999",
            defaultCenterLongitude: "116.40739630000007"
        });

        expect(googleMaps.state("center")).toEqual({ lat: 39.90419989999999, lng: 116.40739630000007 });
    });

    it("without default center Latitude and Longitude sets default center location based on the default configured location", () => {
        const googleMaps = fullRenderGoogleMap(defaultProps);
        googleMaps.setProps({
            fetchingData: false
        });

        expect(googleMaps.state("center")).toEqual({ lat: 51.9107963, lng: 4.4789878 });
    });

    it("creates markers from given locations", () => {
        const customProps = {
            ...defaultProps,
            allLocations: [ { latitude: 40.759011, longitude: -73.9844722, mxObject: undefined, url: "http://dummy.url" } ],
            fetchingData: false,
            autoZoom: false
        };
        const googleMaps = fullRenderGoogleMap(customProps);
        const googleMapsInstance = googleMaps.instance() as any;
        const createMarkerSpy = spyOn(googleMapsInstance, "addMarkers").and.callThrough();
        googleMapsInstance.componentWillReceiveProps(customProps);

        expect(createMarkerSpy).toHaveBeenCalledWith(customProps.allLocations);
    });

    afterAll(() => {
        window.google = undefined;
    });
});
