import { DOM, SFC, SyntheticEvent } from "react";

export const Overlay: SFC<{}> = ({ children }) =>
    DOM.div({ style: { position: "relative" } },
        children,
        DOM.div({
            onClick: preventEvent,
            onTouchStart: preventEvent,
            style: {
                height: "100%",
                left: 0,
                position: "absolute",
                top: 0,
                width: "100%",
                zIndex: 10
            }
        })
    );

const preventEvent = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
};

Overlay.displayName = "Overlay";
