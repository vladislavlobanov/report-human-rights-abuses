import ReactMapGL, {
    NavigationControl,
    GeolocateControl,
    Marker,
} from "react-map-gl";
import { useState, useEffect } from "react";

export default function Map({
    mapboxApiAccessToken,
    center,
    handlePinChange,
    deleteLocation,
    receivedPin,
}) {
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

    const [location, setLocation] = useState({});

    const [unmounted, setUnmounted] = useState(false);

    useEffect(() => {
        return () => {
            setUnmounted(true);
        };
    }, []);

    useEffect(() => {
        setLocation({
            longitude: "",
            latitude: "",
        });
    }, [deleteLocation]);

    useEffect(() => {
        setLocation({
            longitude: receivedPin.longitude,
            latitude: receivedPin.latitude,
        });
    }, [receivedPin]);

    useEffect(() => {
        setViewport({
            latitude: center[1],
            longitude: center[0],
            zoom: 15,
        });
    }, [center]);

    const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

    const ICON_SIZE = 20;

    if (unmounted) {
        return null;
    }
    return (
        <ReactMapGL
            {...viewport}
            width="100%"
            height="100%"
            onViewportChange={(viewport) => setViewport(viewport)}
            onClick={(e) => {
                setLocation({ longitude: e.lngLat[0], latitude: e.lngLat[1] });
                handlePinChange(e.lngLat[0], e.lngLat[1]);
            }}
        >
            {location.longitude && (
                <Marker
                    longitude={Number(location.longitude)}
                    latitude={Number(location.latitude)}
                    draggable={true}
                    onDragEnd={(e) => {
                        setLocation({
                            longitude: e.lngLat[0],
                            latitude: e.lngLat[1],
                        });
                        handlePinChange(e.lngLat[0], e.lngLat[1]);
                    }}
                >
                    <svg
                        height={ICON_SIZE}
                        viewBox="0 0 24 24"
                        style={{
                            cursor: "pointer",
                            fill: "#d00",
                            stroke: "none",
                            transform: `translate(${
                                -ICON_SIZE / 2
                            }px,${-ICON_SIZE}px)`,
                        }}
                    >
                        <path d={ICON} />
                    </svg>
                </Marker>
            )}
            <NavigationControl style={navControlStyle} />
            <GeolocateControl
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
                auto={true}
            />
        </ReactMapGL>
    );
}
