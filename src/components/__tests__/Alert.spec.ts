import { shallow } from "enzyme";
import { createElement } from "react";

import { Alert } from "../Alert";

describe("Alert", () => {
    it("renders the structure", () => {
        const message = "This is an error";
        const alert = shallow(createElement(Alert as any, { message }));

        expect(alert).toBeElement(
            createElement("div", { className: "alert alert-danger widget-carousel-alert" }, message)
        );
    });

    it("renders no structure when the alert message is not specified", () => {
        const alert = shallow(createElement(Alert as any));

        expect(alert).toBeElement(null);
    });
});
