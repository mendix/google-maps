import { random } from "faker";

import { Container } from "../utils/namespace";
import { validLocations, validateLocationProps } from "../utils/Validations";
import locationDataProps = Container.DataSourceLocationProps;

describe("utils/Data", () => {

    describe("#validateLocationProps", () => {
        const contextLocation: Partial<locationDataProps> = {
            dataSourceType: "context",
            latitudeAttribute: "latitude"
        };

        const staticLocation: Partial<locationDataProps> = {
            dataSourceType: "static",
            staticLatitude: "lat"
        };

        const microflowLocation: Partial<locationDataProps> = {
            dataSourceType: "microflow",
            latitudeAttribute: "latitude",
            longitudeAttribute: "longitude"
        };

        it("returns no alert message if autoZoom is enabled", () => {
            const validationMessage = validateLocationProps({ autoZoom: true, mapProvider: "openStreet" });

            expect(validationMessage).toBe("");
        });

        it("returns alert message if autozoom is not enabled and zomm is less than 2", () => {
            const validationMessage = validateLocationProps({ autoZoom: false, zoomLevel: 1, mapProvider: "openStreet" });

            expect(validationMessage).toBe("Zoom Level should be greater than one");
        });

        it("returns no alert if there is a map token for mapProvider mapbox", () => {
            const mapToken = random.uuid();
            const validationMessage = validateLocationProps({ mapProvider: "mapBox", apiToken: mapToken });

            expect(validationMessage).toBe("");
        });

        it("returns alert if there is no map token for mapProvider mapbox", () => {
            const validationMessage = validateLocationProps({ mapProvider: "mapBox" });

            expect(validationMessage).toBe("An api token for mapBox is required");
        });

        it("returns no alert if there are no locations", () => {
            const validationMessage = validateLocationProps({ locations: [], mapProvider: "openStreet" });

            expect(validationMessage).toBe("");
        });

        it("returns alert if data source type is context and there is no latitude or longitude", () => {
            const validationMessage = validateLocationProps({
                mapProvider: "openStreet",
                locations: [ contextLocation as locationDataProps ]
            });

            expect(validationMessage).toBe(`The Latitude attribute and longitude attribute are required for data source
                    context at location 1`);
        });

        it("returns alert if data source type is static and there is no latitude or longitude", () => {
            const validationMessage = validateLocationProps({
                mapProvider: "openStreet",
                locations: [ staticLocation as locationDataProps ]
            });

            expect(validationMessage).toBe("Invalid static locations. Latitude and longitude are required at location 1");
        });

        it("returns alert if data source type is microflow and there is no microflow", () => {
            const validationMessage = validateLocationProps({
                mapProvider: "openStreet",
                locations: [ microflowLocation as locationDataProps ]
            });

            expect(validationMessage).toBe("A Microflow is required for Data source Microflow at location 1");
        });
    });

    describe("#ValidLocation", () => {
        it("returns false if location is not valid", () => {
            const location = [ { latitude: 0, longitude: 0 } ];
            const checkValidLocation = validLocations(location);

            expect(checkValidLocation).toEqual(false);
        });
    });
});
