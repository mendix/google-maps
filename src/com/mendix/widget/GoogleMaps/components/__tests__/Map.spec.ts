describe("Map", () => {
    it("should render with the map structure", () => {
        //
    });

    it("renders with classes", () => { // test against mx-google-maps
        // 
    });

    it("should load the google maps script with API key", () => {
        //
    });

    it("should load the google maps script without API key", () => {
        //
    });

    it("should add a resize listener", () => {
        //
    });

    it("should center the map on resize", () => {
        //
    });

    it("should remove the resize listener", () => {
        //
    });

    describe("with no address", () => {
        it("should not look up the location", () => {
            //
        });

        it("should not display a marker", () => {
            //
        });

        it("should center to the default address", () => {
            //
        });
    });

    describe("with a valid address", () => {
        it("should lookup the location", () => {
            //
        });

        it("should render a marker", () => {
            //
        });

        it("should center to the location of the address", () => {
            //
        });

        it("should display the first marker if multiple locations are found", () => {
            // 
        });
    });

    describe("with an invalid address", () => {
        it("should fail to find a location", () => {
            //
        });

        it("should not render a marker", () => {
            //
        });

        it("should center to the default address", () => {
            //
        });

        it("should display an error", () => {
            //
        });
    });

    describe("when offline", () => {
        it("should show a user error on loading a map", () => {
            //
        });

        it("should show a user error when looking up an address", () => {
            //
        });
    });
});
