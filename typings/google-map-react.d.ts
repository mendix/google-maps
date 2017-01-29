declare module "google-map-react" {

    export interface LatLng {
        lat: number | undefined;
        lng: number | undefined;
    }

    export interface GoogleMapLoader {
        map: google.maps.Map;
    }

    export interface bootstrapURLKeysProps {
        key: string | undefined
    }

    export interface GoogleMapProps {
        center: LatLng;
        defaultZoom: number;
        bootstrapURLKeys?: bootstrapURLKeysProps;
        onGoogleApiLoaded?: Function;
        onCenterChange?:Function;
        googleMapLoader?:Function;
        resetBoundsOnResize?: boolean;
        yesIWantToUseGoogleMapApiInternals?: boolean;
    }

    export interface GoogleMapComponent extends React.ComponentClass<GoogleMapProps> {}

    export const GoogleMap: GoogleMapComponent;

    export { GoogleMap as default };
}
