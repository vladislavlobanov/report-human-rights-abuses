/* eslint-disable indent */
import GeocoderService from "@mapbox/mapbox-sdk/services/geocoding";
const secrets = require("../../server/secrets.json");
import Map from "./map";
import InfoCard from "./infocard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsAndWannabees } from "./redux/friends/slice.js";

export default function Report() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [center, setCenter] = useState([]);
    const [pin, setPin] = useState();
    const [fields, setFields] = useState({});

    const geocoder = GeocoderService({
        accessToken: secrets.mapbox,
    });

    useEffect(() => {
        dispatch(receiveFriendsAndWannabees());
    }, []);

    const handlePinChange = (longitude, latitude) => {
        setPin({ longitude: longitude, latitude: latitude });
    };

    async function onInput(event) {
        if (event.target.value) {
            let abort;
            (async () => {
                const query = event.target.value;
                const response = await geocoder
                    .forwardGeocode({ query, limit: 5 })
                    .send();
                if (!abort) {
                    setSearchData(response.body.features);
                }
            })();
            return () => {
                abort = true;
            };
        }
    }

    const handleMore = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post("/api/sendreport", {
                fields: fields,
            });
            if (resp.status == 200) {
                console.log("all good");
            }
        } catch (err) {
            console.log("Err in post api/sendreport");
        }
    };

    const searchHtml = (
        <>
            {searchTerm && (
                <>
                    {searchTerm && searchData.length > 0 ? (
                        <>
                            <div className="dropDown">
                                {searchData.map((searchData, index) => (
                                    <div
                                        key={index}
                                        tabIndex={0}
                                        className="dropDownElement"
                                        onInput={onInput}
                                        onClick={() => {
                                            setSearchTerm(
                                                searchData.place_name
                                            );

                                            setCenter(searchData.center);
                                            setSearchData([]);
                                        }}
                                    >
                                        {searchData.place_name}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : null}
                </>
            )}
        </>
    );

    const handleInputs = (e) => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value,
            ...pin,
        });
    };

    useEffect(() => {
        setFields({
            ...fields,
            ...pin,
        });
    }, [pin]);

    return (
        <div className="reportContainer">
            <h1 onClick={() => console.log(fields)}>Report component</h1>
            <form>
                <label htmlFor="who">Who:</label>
                <input
                    name="who"
                    onChange={(e) => {
                        handleInputs(e);
                    }}
                />
                <label htmlFor="what">What:</label>
                <input
                    name="what"
                    onChange={(e) => {
                        handleInputs(e);
                    }}
                />
                <label htmlFor="when">When:</label>
                <input
                    name="when"
                    onChange={(e) => {
                        handleInputs(e);
                    }}
                />

                <label htmlFor="where">Where:</label>
                <div className="whereContainer">
                    <input
                        autoComplete="off"
                        name="where"
                        value={searchTerm}
                        onInput={onInput}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchHtml}
                </div>
                <label htmlFor="why">Why:</label>
                <input
                    name="why"
                    onChange={(e) => {
                        handleInputs(e);
                    }}
                />
                {fields.who &&
                fields.what &&
                fields.when &&
                fields.longitude &&
                fields.latitude &&
                fields.why ? (
                    <>
                        <button onClick={(e) => handleMore(e)}>Add more</button>
                        <button>Submit</button>
                    </>
                ) : (
                    <>
                        <button onClick={(e) => handleMore(e)} disabled>
                            Add more
                        </button>
                        <button disabled>Submit</button>
                    </>
                )}
            </form>
            <div className="map">
                <Map
                    center={center}
                    mapboxApiAccessToken={secrets.mapbox}
                    handlePinChange={handlePinChange}
                />
            </div>

            <InfoCard />
        </div>
    );
}
