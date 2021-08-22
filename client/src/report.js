import GeocoderService from "@mapbox/mapbox-sdk/services/geocoding";
const secrets = require("../../server/secrets.json");
import Map from "./map";
import { useState, useEffect } from "react";

export default function Report() {
    const [searchTerm, setSearchTerm] = useState();
    const [searchData, setSearchData] = useState([]);

    const geocoder = GeocoderService({
        accessToken: secrets.mapbox,
    });

    useEffect(() => {
        if (searchTerm) {
            let abort;
            (async () => {
                const response = await geocoder
                    .forwardGeocode({ searchTerm, limit: 5 })
                    .send();
                if (!abort) {
                    setSearchData(response.body.features);
                }
            })();
            return () => {
                abort = true;
            };
        }
    }, [searchTerm]);

    const handleChange = async (e) => {
        console.log(secrets.mapbox);
        const query = "Berlin";
        const response = await geocoder
            .forwardGeocode({ query, limit: 5 })
            .send();
        console.log(response.body.features); //return array
        // need to manage requests sent out as in friends
    };

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
                <input
                    name="where"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label htmlFor="why">Why:</label>
                <input name="why" />
                <button>Submit</button>
            </form>
            <div className="map">
                <Map mapboxApiAccessToken={secrets.mapbox} />
            </div>
        </div>
    );
}
