import { shallow } from "enzyme";
import * as React from "react";

import { Map, MapProps } from "../Map";

describe("Map component", () => {
    const lat = "0.32";
    const long = "35";
    const render = (props: MapProps) => shallow(<Map {...props} />);

    it("should render default location", () => {
        const output = render({ lat, long });
        expect(output).toMatchStructure(
            <div className="google-map-container">
                <div className="google-map" />
            </div>
        );
    });
});
