
import * as _ from "lodash";
import { Component, DOM, Props, createElement } from "react";
import { GoogleMap, withGoogleMap } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";

export interface MapProps extends Props<Map> {
    apiKey?: string;
    address?: string;
}

const MxGoogleMap = _.flowRight(
    withScriptjs,
    withGoogleMap(
        createElement(GoogleMap, {
            defaultCenter: { lat: 59.938043, lng: 30.337157 },
            defaultZoom: 14
        })));

export class Map extends Component<MapProps, {}> {
    static defaultProps: MapProps = {
        address: undefined
    };

    constructor(props: MapProps) {
        super(props);
        this.state = { isLoaded: typeof google !== "undefined" };
    }


    render() {
        return (
                createElement(MxGoogleMap({
                    containerElement: DOM.div({ style: { height: "100%" } }),
                    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyACjBNesZXeRFx86N7RMCWiTQP5GT_jDec",
                    loadingElement: DOM.div({ style: { height: "100%" } }),
                    mapElement: DOM.div({ style: { height: "100%" } })
                }))
            );
    }

    componentDidMount() {
        //
    }

    componentWillUnmount() {
      //
     }
}
