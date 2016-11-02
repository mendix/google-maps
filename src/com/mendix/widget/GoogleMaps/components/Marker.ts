interface MarkerProps {
    location: google.maps.LatLng;
    map: google.maps.Map;
}
export const Marker = (props: MarkerProps) => (
    new google.maps.Marker({
        map: props.map,
        position: props.location
    })
);
