declare module "google-map-react" {

    export interface LatLng {
        lat: number | undefined;
        lng: number | undefined;
    }

    export interface GoogleMapLoader {
        map: google.maps.Map;
    }

    export interface BootstrapURLKeysProps {
        key: string | undefined;
    }

    export interface MapLoaderProps {
        minZoom: number;
        minZoomOverride: boolean;
        maxZoom?: number;
        scrollwheel?: boolean;
        streetViewControl?: boolean;
        mapTypeControl?: boolean;
        scaleControl?: boolean;
        draggable?: boolean;
        zoomControl?: boolean;
    }

    export interface GoogleMapProps {
        bootstrapURLKeys?: BootstrapURLKeysProps;
        center?: LatLng;
        defaultZoom?: number;
        googleMapLoader?: () => void;
        onGoogleApiLoaded?: (mapLoader: GoogleMapLoader) => void;
        options?: MapLoaderProps;
        resetBoundsOnResize?: boolean;
        yesIWantToUseGoogleMapApiInternals?: boolean;
    }

    export const GoogleMap: React.ComponentClass<GoogleMapProps>;

    export { GoogleMap as default };
}
