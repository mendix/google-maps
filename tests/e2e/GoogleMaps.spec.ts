import homepage from "./pages/home.page";
import singleLocationPage from "./pages/singleLocation.page";
import { Element } from "webdriverio";

describe("Google maps", () => {
    it("should show single location", () => {
        singleLocationPage.open();
        homepage.markers.waitForVisible();

        const markerList: Element[] = homepage.markers.value;
        expect(markerList.length).toBe(1);

    });

    it("when xpath selected should show locations", () => {
        homepage.open();
        homepage.firstGridRow1.waitForVisible();
        homepage.firstGridRow1.click();
        homepage.secondGridRow1.waitForVisible();
        homepage.secondGridRow1.click();
        homepage.secondGridRow2.waitForVisible();
        homepage.secondGridRow2.click();
        homepage.secondGridRow3.waitForVisible();
        homepage.secondGridRow3.click();
        homepage.markers.waitForVisible();

        const markerList: Element[] = homepage.markers.value;
        expect(markerList.length).toBeGreaterThan(1);
    });
});
