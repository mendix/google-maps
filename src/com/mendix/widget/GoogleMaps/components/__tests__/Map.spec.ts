import { mount } from "enzyme";
import { createElement } from "react";

import { Map, MapProps } from "../Map";

describe("Map component", () => {
    let testProps: MapProps = {
        address: "Lumumba Ave, Kampala, Uganda",
        apiKey: "AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec"
    };
    let mountMapComponent = mount(createElement(Map, testProps));
    let map = mountMapComponent.instance() as Map;
    const timeOut = 4000;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    const latitude = 0.3229765;
    const longitude = 32.576219700000024;

    it("should render google map structure", () => {
        expect(mountMapComponent.find("div.mx-google-maps").length).toBe(1);
    });

    xit("should handle empty address", (done) => {
        setTimeout(() => {
            const noAddress = "";
            mountMapComponent.setProps({ address: noAddress });
            map.getLocation(noAddress, callback);
        }, timeOut);
        const callback = (coordinates: google.maps.LatLng) => {
            expect(coordinates.lat()).not.toBe(latitude);
            expect(coordinates.lng()).not.toBe(longitude);
            // TODO check for default center

            done();
        };
    });

    it("should geocode address", (done) => {
        setTimeout(() => {
            map.getLocation(testProps.address, callback);
        }, timeOut);
        const callback = (coordinates: google.maps.LatLng) => {
            expect(coordinates.lat()).toBe(latitude);
            expect(coordinates.lng()).toBe(longitude);

            done();
        };
    });

    it("should fail to geocode address", (done) => {
        setTimeout(() => {
            const noAddress = "no address";
            mountMapComponent.setProps({ address: noAddress });
            map.getLocation(noAddress, callback);
        }, timeOut);
        const callback = (coordinates: google.maps.LatLng) => {
            expect(coordinates.lat()).not.toBe(latitude);
            expect(coordinates.lng()).not.toBe(longitude);

            done();
        };
    });

    xit("should center map to default address", (done) => {
        // TODO: Implement test
    });

    it("should check that google maps is defined ", (done) => {
        setTimeout(() => {
            map.getLocation(testProps.address, callback);
        }, timeOut);
        const callback = (coordinates: google.maps.LatLng) => {
            expect(google).toBeDefined();

            done();
        };
    });

    xit("should check that google maps is not defined", () => {
        // TODO: Implement test.
    });
});
