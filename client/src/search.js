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
                    console.log(searchData);
                }
            })();
            return () => {
                abort = true;
            };
        }
    }, [searchTerm]);

    return (
        <>
            <h3>Search</h3>
            <input
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter your search request"
            ></input>
        </>
    );
}
