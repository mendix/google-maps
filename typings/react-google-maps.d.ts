declare module "react-google-maps" {
    interface GoogleMapProps {
        defaultCenter: any;
        defaultZoom: number;
        onClick:()=>{};
        ref:()=>{};
    }
    export const GoogleMap: React.ComponentClass<GoogleMapProps>;
    interface GoogleMapLoaderProps {
        containerElement: any;
        googleMapElement: any;
    }
    interface withGoogleMapProps {
        containerElement: any;
        mapElement: any;
    }
    interface MarkerProps {
        position: { lat: number; lng: number; };
    }
    export const GoogleMapLoader: React.ComponentClass<GoogleMapLoaderProps>;
    export const Marker: React.ComponentClass<MarkerProps>;
    export function withGoogleMap(WrappedComponent: any): React.ComponentClass<withGoogleMapProps>;
};
declare module "react-google-maps/lib/async/withScriptjs" {

    interface withScriptjsProps {        
        googleMapURL: String;
        loadingElement: any;
    }
    
    export default function withScriptjs(WrappedComponent: any): React.ComponentClass<withScriptjsProps>;
}
