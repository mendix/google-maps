import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Map, MapProps } from "../Map";

describe("Map component", () => {
    const testProps: MapProps = {
        address: "Lumumba Ave, Kampala, Uganda",
        apiKey: "AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec"
    };

    const shallowMapComponent = (props: MapProps) => shallow(createElement(Map, props));

    it("should render google map structure", () => {
        const output = shallowMapComponent(testProps);

        expect(output).toMatchStructure(
            DOM.div({ className: "mx-google-maps" })
        );
    });

    xit("should handle empty address", () => {
        // TODO: Implement test.
    });

    xit("should handle non existing address", () => {
        // TODO: Implement test.
    });

    xit("should geocode address", () => {
        // TODO: Implement test.
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
