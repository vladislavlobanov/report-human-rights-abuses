import ReactMapGL, { NavigationControl, GeolocateControl } from "react-map-gl";
import { useState } from "react";

export default function Map({ mapboxApiAccessToken }) {
    const navControlStyle = {
        right: 10,
        top: 10,
    };
    const [viewport, setViewport] = useState({
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
        mapboxApiAccessToken: mapboxApiAccessToken,
    });

    return (
        <ReactMapGL
            {...viewport}
            width="100%"
            height="100%"
            onViewportChange={(viewport) => setViewport(viewport)}
        >
            <NavigationControl style={navControlStyle} />
            <GeolocateControl
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
                auto={true}
            />
        </ReactMapGL>
    );
}
