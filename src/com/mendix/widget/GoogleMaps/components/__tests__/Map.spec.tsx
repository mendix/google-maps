import { shallow } from "enzyme";
import * as React from "react";

import { MapDiv } from "../Map";

describe("Map component", () => {
    const render = () => shallow(<MapDiv />);

    it("should render default location", () => {
        const output = render();
        expect(output).toMatchStructure(
            <div className="google-map" />
        );
    });
});
