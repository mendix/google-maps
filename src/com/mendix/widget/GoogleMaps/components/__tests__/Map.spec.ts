import { mount } from "enzyme";
import { createElement } from "react";

import { Map, MapProps } from "../Map";
import { Marker } from "../Marker";

describe("Map component", () => {
    let testProps: MapProps = {
        address: "Lumumba Ave, Kampala, Uganda",
        apiKey: "AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec"
    };
    let mountMapDocument = mount(createElement(Map, testProps));
    let mapComponent = mountMapDocument.instance() as Map;
    const timeOut = 4000;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    const testPropLatitude = 0.3229765;
    const testPropLongitude = 32.576219700000024;
    const defaultLatitude = 39.6081562;
    const defaultLongitude = -77.31998970000001;

    it("should render google map structure", () => {
        expect(mountMapDocument.find("div.mx-google-maps").length).toBe(1);
    });

    xit("should handle empty address", (done) => {
        setTimeout(() => {
            const noAddress = "";
            mountMapDocument.setProps({ address: noAddress });
            mapComponent.getLocation(noAddress, callback);
        }, timeOut);
        const callback = (coordinates: google.maps.LatLng) => {
            expect(coordinates.lat()).not.toBe(testPropLatitude);
            expect(coordinates.lng()).not.toBe(testPropLongitude);
            // TODO check for default center

            done();
        };
    });

    it("should geocode address", (done) => {
        setTimeout(() => {
            mapComponent.getLocation(testProps.address, callback);
        }, timeOut);
        const callback = (coordinates: google.maps.LatLng) => {
            expect(coordinates.lat()).toBe(testPropLatitude);
            expect(coordinates.lng()).toBe(testPropLongitude);

            done();
        };
    });

    it("should fail to geocode address", (done) => {
        setTimeout(() => {
            const noAddress = "no address";
            mountMapDocument.setProps({ address: noAddress });
            mapComponent.getLocation(noAddress, callback);
        }, timeOut);
        const callback = (coordinates: google.maps.LatLng) => {
            expect(coordinates.lat()).not.toBe(testPropLatitude);
            expect(coordinates.lng()).not.toBe(testPropLongitude);

            done();
        };
    });

    it("should center map to default address", (done) => {
        setTimeout(() => {
            const map = mapComponent.getMap();

            expect(map.getCenter().lat()).toBe(defaultLatitude);
            expect(map.getCenter().lng()).toBe(defaultLongitude);
        }, timeOut);

        done();
    });

    it("should check that google maps is defined ", (done) => {
        setTimeout(() => {
            mapComponent.getLocation(testProps.address, callback);
        }, timeOut);
        const callback = (coordinates: google.maps.LatLng) => {
            expect(google).toBeDefined();

            done();
        };
    });

    xit("should check that google maps is not defined", () => {
        // TODO: Implement test.
    });

    it("marker should be created using correct props", () => {
        const marker = Marker({
            location: new google.maps.LatLng(defaultLatitude, defaultLongitude),
            map: mapComponent.getMap()
        });
        expect(marker.getPosition().lat()).toBe(defaultLatitude);
        expect(marker.getPosition().lng()).toBe(defaultLongitude);
    });

    xit("marker should be on the given position", () => {
        // TODO: Implement test.
    });
});
