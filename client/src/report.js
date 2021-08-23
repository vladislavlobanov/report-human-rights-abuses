import GeocoderService from "@mapbox/mapbox-sdk/services/geocoding";
const secrets = require("../../server/secrets.json");
import Map from "./map";
import { useState } from "react";

export default function Report() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [center, setCenter] = useState([]);

    const geocoder = GeocoderService({
        accessToken: secrets.mapbox,
    });

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

    const handleKeyPress = (e) => {};

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

    return (
        <div className="reportContainer">
            <h1>Report component</h1>
            <form>
                <label htmlFor="who">Who:</label>
                <input name="who" />
                <label htmlFor="what">What:</label>
                <input name="what" />
                <label htmlFor="when">When:</label>
                <input name="when" />

                <label htmlFor="where">Where:</label>
                <div className="whereContainer">
                    <input
                        autoComplete="off"
                        name="where"
                        value={searchTerm}
                        onInput={onInput}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            handleKeyPress(e);
                        }}
                    />
                    {searchHtml}
                </div>
                <label htmlFor="why">Why:</label>
                <input name="why" />
                <button>Submit</button>
            </form>
            <div className="map">
                <Map center={center} mapboxApiAccessToken={secrets.mapbox} />
            </div>
        </div>
    );
}
