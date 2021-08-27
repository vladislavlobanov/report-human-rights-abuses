import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MailTo from "./mailto";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState();
    const [searchData, setSearchData] = useState([]);
    const useStyles = makeStyles((theme) => ({
        input: {
            backgroundColor: "white",
            borderRadius: "inherit",
            width: "300px",
        },
    }));
    const classes = useStyles();
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
            hour12: false,
        };
        d = new Intl.DateTimeFormat("en-UK", options).format(d).toString();
        return d;
    };

    return (
        <div className="feedContainer">
            <h2>Search</h2>

            {/* <input
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter your search request"
            ></input> */}

            <TextField
                label="Enter your search request"
                variant="outlined"
                name="search"
                inputProps={{ className: classes.input }}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                }}
            />

            {searchTerm && (
                <>
                    {searchTerm && searchData.length > 0 ? (
                        <>
                            <div className="feedCardsContainer">
                                {searchData.map((searchData, index) => (
                                    <div key={index} className="feedCard">
                                        <div>
                                            Published by:{" "}
                                            <Link to={`/case/${searchData.id}`}>
                                                {searchData.first}{" "}
                                                {searchData.last}
                                            </Link>
                                        </div>
                                        <div>
                                            Contact: {""}
                                            <MailTo
                                                label={searchData.email}
                                                mailto={
                                                    "mailto:" + searchData.email
                                                }
                                            />
                                        </div>
                                        <div>
                                            Date:{" "}
                                            <span>
                                                {dateConverter(
                                                    searchData.timestamp
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="makeBold">
                                                {searchData.headline}{" "}
                                            </span>
                                        </div>
                                        <div>
                                            <Link to={`/case/${searchData.id}`}>
                                                Full case
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div>Nothing has been found</div>
                    )}
                </>
            )}
        </div>
    );
}
