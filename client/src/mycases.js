import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket.js";
import axios from "axios";

const MyCases = () => {
    let myCases = useSelector((state) => state.cases);

    useEffect(async () => {
        try {
            const { data } = await axios.get(`/getmyheadlines/`);
            socket.emit("myCases", data);
        } catch (err) {
            console.log("Err in getting feed", err);
        }
    }, []);

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

    if (!myCases) {
        return null;
    }

    return (
        <div className="feedContainer">
            <h2>My submitted cases</h2>
            <div className="insideFeedContainer">
                {!myCases.length ? (
                    <div>No submitted cases yet</div>
                ) : (
                    <>
                        <div className="feedCardsContainer">
                            {myCases.map((headline, index) => (
                                <div key={index} className="feedCard">
                                    <div>
                                        Date:{" "}
                                        <span>
                                            {dateConverter(headline.timestamp)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="makeBold">
                                            {headline.headline}{" "}
                                        </span>
                                    </div>
                                    <div>
                                        {headline.publicornot ? (
                                            <Link to={`/case/${headline.id}`}>
                                                Full case
                                            </Link>
                                        ) : (
                                            <Link to={`/case/${headline.link}`}>
                                                Full case
                                            </Link>
                                        )}
                                        <div className="makeSpace"></div>
                                        {headline.publicornot ? (
                                            <div>PUBLIC</div>
                                        ) : (
                                            <>
                                                <span className="makeBold red">
                                                    <div>NOT PUBLIC</div>

                                                    <div>
                                                        ACCESS CODE:{" "}
                                                        {headline.code}
                                                    </div>
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyCases;
