import { Client, Element, RawResult } from "webdriverio";

class HomePage {
    public get markers(): Client<RawResult<Element[]>> & RawResult<Element[]> {
        return browser.elements(".widget-google-maps-marker");
    }

    public get firstGridRow1(): Client<RawResult<Element>> & RawResult<Element> {
        return browser.element(".mx-name-index-0");
    }

    public get secondGridRow1(): Client<RawResult<Element>> & RawResult<Element> {
        return browser.element(".mx-name-grid2 .mx-name-index-0");
    }

    public get secondGridRow2(): Client<RawResult<Element>> & RawResult<Element> {
        return browser.element(".mx-name-grid2 .mx-name-index-1");
    }

    public get secondGridRow3(): Client<RawResult<Element>> & RawResult<Element> {
        return browser.element(".mx-name-grid2 .mx-name-index-2");
    }

    public open(): void {
        browser.url("/");
    }
}
const homepage = new HomePage();
export default homepage;
