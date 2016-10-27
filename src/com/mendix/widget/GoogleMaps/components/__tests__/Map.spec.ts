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

    it("should render google map structure", () => {
        expect(mountMapComponent.find("div.mx-google-maps").length).toBe(1);
    });

    xit("should handle empty address", () => {
        // TODO: Implement test.
    });

    xit("should handle non existing address", () => {
        // TODO: Implement test.
    });

    it("should geocode address", (done) => {
        setTimeout(() => {
            map.getLocation(testProps.address, callback);
        }, 4000);
        const callback = (coordinates: google.maps.LatLng) => {
            expect(coordinates.lat()).toBe(0.3229765);
            expect(coordinates.lng()).toBe(32.576219700000024);

            done();
        };

    });

    xit("should fail to geocode address", () => {
        // TODO: Implement test.
    });

    xit("should center map to user address", () => {
        // TODO: Implement test.
    });

    xit("should center map to default address", () => {
        // TODO: Implement test.
    });

    xit("should check that google maps is defined ", () => {
        // TODO: Implement test.
    });

    xit("should check that google maps is not defined", () => {
        // TODO: Implement test.
    });
});
