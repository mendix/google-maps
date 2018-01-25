import { GoogleMapContainerProps } from "../components/GoogleMapContainer";

export class ValidateConfigs {

    public static validate(props: GoogleMapContainerProps): string {
        const message: string[] = [];
        const invalidEnumKeys = props.markerImages.filter(markerImage =>
            /^\w+$/.test(markerImage.enumKey)
        );

        if (props.dataSource === "static" && !props.staticLocations.length) {
            message.push("At least one static location is required for 'Data source 'Static'");
        }

        if (props.dataSource === "static") {
            const invalidLocations = props.staticLocations.filter(location =>
                !location.address && !(location.latitude && location.longitude)
            );
            if (invalidLocations.length > 0) {
                message.push(`${invalidLocations} invalid static locations.
            The 'Address' or 'Latitude' and 'Longitude' is required for each 'Static' data source`);
            }
        }

        if (props.dataSource === "XPath" && !props.locationsEntity) {
            message.push("The 'Locations entity' is required for 'Data source' 'XPath'");
        }

        if (props.dataSource === "microflow" && !props.dataSourceMicroflow) {
            message.push("A 'Microflow' is required for 'Data source' 'Microflow'");
        }

        if ((props.dataSource === "XPath" || props.dataSource === "microflow") && (!props.addressAttribute &&
            !(props.longitudeAttribute && props.latitudeAttribute))) {
            message.push("The 'Address attribute' or 'Latitude Attribute' and 'Longitude attribute' "
                + "is required for this data source 'Database / Microflow'");
        }

        if (props.dataSource === "context" && (!props.addressAttributeContext &&
                !(props.longitudeAttributeContext && props.latitudeAttributeContext))) {
            message.push("The 'Address attribute' or 'Latitude Attribute' and 'Longitude attribute' "
                + "is required for this data source 'Context'");
        }

        if (!props.autoZoom && props.zoomLevel < 2) {
            message.push("Zoom level must be greater than 1");
        }

        if (invalidEnumKeys.length > 0) {
            message.push("Invalid enumeration keys on custom markers. " +
            "Enumeration keys should start with a letter and can only contain letters, digits and underscores");
        }

        if (props.mapStyles.trim()) {
            try {
                JSON.parse(props.mapStyles);
            } catch (error) {
                message.push("Error parsing Maps style: " + error.message);
            }
        }

        return message.join(", ");
    }
}
