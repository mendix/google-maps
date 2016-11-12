declare module "react-google-maps" {
    interface LatLng {
        lat: number;
        lng: number;
    }
    interface MarkerProps {
        position: { lat: number; lng: number; };
    }
    export const Marker: React.ComponentClass<MarkerProps>;
    export interface GoogleMapProps {
        center: LatLng;
        defaultZoom: number;
        ref:Function;
        marker?:  React.ComponentClass<MarkerProps>;
        onMapLoad?: Function;
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
    export const GoogleMapLoader: React.ComponentClass<GoogleMapLoaderProps>;
    export function withGoogleMap(WrappedComponent: React.Component): React.ComponentClass<withGoogleMapProps>;
};
declare module "react-google-maps/lib/async/withScriptjs" {

    interface withScriptjsProps {        
        googleMapURL: String;
        loadingElement: React.ReactElement;
    }
    
    export default function withScriptjs(WrappedComponent: React.Component): React.ComponentClass<withScriptjsProps>;
}
