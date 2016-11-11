declare module "react-google-maps" {
    interface LatLng {
        lat: number;
        lng: number;
    }
    interface GoogleMapProps {
        center: LatLng;
        defaultZoom: number;
        ref:Function;
    }
    export const GoogleMap: React.ComponentClass<GoogleMapProps>;
    interface GoogleMapLoaderProps {
        containerElement: React.ReactElement;
        googleMapElement: React.ReactElement;
    }
    interface withGoogleMapProps {
        containerElement: React.ReactElement;
        mapElement: React.ReactElement;
    }
    interface MarkerProps {
        position: { lat: number; lng: number; };
    }
    export const GoogleMapLoader: React.ComponentClass<GoogleMapLoaderProps>;
    export const Marker: React.ComponentClass<MarkerProps>;
    export function withGoogleMap(WrappedComponent: React.Component): React.ComponentClass<withGoogleMapProps>;
};
declare module "react-google-maps/lib/async/withScriptjs" {

    interface withScriptjsProps {        
        googleMapURL: String;
        loadingElement: React.ReactElement;
    }
    
    export default function withScriptjs(WrappedComponent: React.Component): React.ComponentClass<withScriptjsProps>;
}
