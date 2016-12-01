import { DOM, createElement } from "react";
import { shallow } from "enzyme";

import { Marker } from "../Marker";

describe("Marker", () => {

    it("should render with the map structure", () => {
        const marker = shallow(createElement(Marker, { lat: 30, lng: 118 }));
        expect(marker).toBeElement(
            DOM.div({ className: "mx-google-maps-marker" })
        );
    });
});
