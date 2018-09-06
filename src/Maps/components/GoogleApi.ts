import { Component, ComponentType, createElement } from "react";
import { GoogleMapsProps } from "./GoogleMap";

export interface GoogleApiWrapperState {
    scriptsLoaded?: boolean;
    alertMessage?: string;
}

const googleApiWrapper = (script: string) => <P extends GoogleMapsProps>(wrappedComponent: ComponentType<P>) => {
    class GoogleApiWrapperComponent extends Component<P, GoogleApiWrapperState> {
        readonly state: GoogleApiWrapperState = { scriptsLoaded: false, alertMessage: "" };

        render() {
            const props = {
                ...this.state,
                ...this.props as GoogleMapsProps
            };

            return createElement(wrappedComponent, { ...props as any });
        }

        componentDidMount() {
            if (typeof google === "undefined") {
                this.loadScript(script);
            } else {
                this.setState({ scriptsLoaded: true });
            }
        }

        private addScript = (googleScript: string) => {
            if (!(window as any)["_com.mendix.widget.custom.Maps.Maps"]) {
                (window as any)["_com.mendix.widget.custom.Maps.Maps"] = new Promise((resolve, reject) => {
                    const refNode = window.document.getElementsByTagName("script")[0];
                    const scriptElement = document.createElement("script");
                    scriptElement.async = true;
                    scriptElement.defer = true;
                    scriptElement.type = "text/javascript";
                    scriptElement.id = "googleScript";
                    scriptElement.src = googleScript + this.props.mapsToken + `&libraries=places`;
                    scriptElement.onerror = (err) => reject(`Failed due to ${err.message}`);
                    scriptElement.onload = () => {
                        if (typeof google === "object" && typeof google.maps === "object") {
                            resolve();
                        }
                    };
                    if (refNode && refNode.parentNode) {
                        refNode.parentNode.insertBefore(scriptElement, refNode);
                    }
                });
            }

            return (window as any)["_com.mendix.widget.custom.Maps.Maps"];
        }

        private loadScript = (googleScript: string) => {
            this.addScript(googleScript)
                .then(() => this.setState({ scriptsLoaded: true }))
                .catch((error: string) => this.setState({ alertMessage: `Failed due to ${error}` }));
        }

    }

    return GoogleApiWrapperComponent;
};

export default googleApiWrapper;
