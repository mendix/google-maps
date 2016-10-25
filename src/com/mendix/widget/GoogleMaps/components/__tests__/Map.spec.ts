import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Map , MapProps } from "../Map";

describe("Map component", () => {
    const testProps: MapProps = {
         address: "Lumumba Ave, Kampala, Uganda",
         apiKey: "AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec"};

    const mapComponent = (props: MapProps) => shallow(createElement(Map, props));

    it("should render google map structure", () => {
        const output = mapComponent(testProps);

        expect(output).toMatchStructure(
           DOM.div({ className: "mx-google-maps" })
        );
    });
});
