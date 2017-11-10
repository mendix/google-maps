import { GoogleMapContainerProps } from "../components/GoogleMapContainer";

export class ValidateConfigs {

    public static validate(props: GoogleMapContainerProps): string {
        let message = "";
        const invalidEnumKeys = props.markerImages.filter(markerImage =>
            /\s/.test(markerImage.enumKey)
        );

        if (props.dataSource === "static" && !props.staticLocations.length) {
            message = "At least one static location is required for 'Data source 'Static'";
        }

        if (props.dataSource === "static") {
            const invalidLocations = props.staticLocations.filter(location =>
                !location.address && !(location.latitude && location.longitude)
            );
            if (invalidLocations.length > 0) {
                message = `${invalidLocations} invalid static locations.
            The 'Address' or 'Latitude' and 'Longitude' is required for each 'Static' data source`;
            }
        }

        if (props.dataSource === "XPath" && !props.locationsEntity) {
            message = "The 'Locations entity' is required for 'Data source' 'XPath'";
        }

        if (props.dataSource === "microflow" && !props.dataSourceMicroflow) {
            message = "A 'Microflow' is required for 'Data source' 'Microflow'";
        }

        if (props.dataSource !== "static" && (!props.addressAttribute &&
            !(props.longitudeAttribute && props.latitudeAttribute))) {
            message = "The 'Address attribute' or 'Latitude Attribute' and 'Longitude attribute' "
                + "is required for this data source";
        }

        if (!props.autoZoom && props.zoomLevel < 2) {
            message = "Zoom level must be greater than 1";
        }

        if (invalidEnumKeys.length > 0) {
            message = `${invalidEnumKeys} invalid enumeration keys on custom markers. Enumeration keys should not contain space `;
        }

        return message;
    }
}
