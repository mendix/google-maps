class SingleLocationPage {
    public open(): void {
        browser.url("/p/CorrectAddress");
    }
}
const singleLocationPage = new SingleLocationPage();
export default singleLocationPage;
