import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState();
    const [searchData, setSearchData] = useState([]);

    useEffect(() => {
        if (searchTerm) {
            let abort;
            (async () => {
                const { data } = await axios.get(
                    `/api/search-cases/${searchTerm}`
                );
                if (!abort) {
                    setSearchData(data);
                }
            })();
            return () => {
                abort = true;
            };
        }
    }, [searchTerm]);

    const dateConverter = (dateToConvert) => {
        let d = new Date(dateToConvert);
        var options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        };
        d = new Intl.DateTimeFormat("en-US", options).format(d).toString();
        return d;
    };

    return (
        <>
            <h3>Search</h3>
            <input
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter your search request"
            ></input>
            {searchTerm && (
                <>
                    {searchTerm && searchData.length > 0 ? (
                        <>
                            {searchData.map((searchData, index) => (
                                <div key={index}>
                                    <div>
                                        <Link to={`/case/${searchData.id}`}>
                                            {searchData.first} {searchData.last}
                                        </Link>
                                    </div>
                                    <div>
                                        Published on{" "}
                                        <span>
                                            {dateConverter(
                                                searchData.timestamp
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        SHORT TEXT SENT BY USER:{" "}
                                        {searchData.headline}{" "}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div>Nothing has been found</div>
                    )}
                </>
            )}
        </>
    );
}
