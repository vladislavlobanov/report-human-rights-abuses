import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import { socket } from "./socket.js";
import MailTo from "./mailto";

export default function Feed() {
    let headlines = useSelector((state) => state.headlines);

    const [lowest, setLowest] = useState("");
    const [hideMoreButton, setHideMoreButton] = useState(false);
    const [receivedData, setData] = useState();

    useEffect(() => {
        if (!headlines) {
            return;
        }
        let newArr = [];
        for (let i = 0; i < headlines.length; i++) {
            newArr.push(headlines[i].id);
        }
        let lowestId = newArr.sort((a, b) => a - b)[0];
        setLowest(lowestId);
        if (lowestId == receivedData) {
            setHideMoreButton(true);
        }
    }, [headlines]);

    useEffect(async () => {
        try {
            const { data } = await axios.get(`/getfeed`);
            socket.emit("lastHeadlines", data);
        } catch (err) {
            console.log("Err in getting feed", err);
        }
    }, []);

    if (!headlines) {
        return null;
    }

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

    const moreHeadlines = async () => {
        try {
            const { data } = await axios.get("/getmore", {
                params: {
                    id: lowest,
                },
            });

            const newSet = data.map((el) => {
                return {
                    email: el.email,
                    first: el.first,
                    headline: el.headline,
                    id: el.id,
                    last: el.last,
                    timestamp: el.timestamp,
                    user_id: el.user_id,
                };
            });
            socket.emit("newSet", newSet);
            setData(data[0].lowestId);
        } catch (err) {
            console.log("Err in getting more headlines", err);
        }
    };

    return (
        <div className="feedContainer">
            <h2>Feed</h2>
            <div className="insideFeedContainer">
                {!headlines.length ? (
                    <div>No messages in the feed yet</div>
                ) : (
                    <>
                        <div className="feedCardsContainer">
                            {headlines.map((headline, index) => (
                                <div key={index} className="feedCard">
                                    <div>
                                        Published by:{" "}
                                        <Link to={`/case/${headline.id}`}>
                                            {headline.first} {headline.last}
                                        </Link>
                                    </div>
                                    <div>
                                        Contact: {""}
                                        <MailTo
                                            label={headline.email}
                                            mailto={"mailto:" + headline.email}
                                        />
                                    </div>
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
                                        <Link to={`/case/${headline.id}`}>
                                            Full case
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!hideMoreButton && (
                            <button
                                onClick={() => moreHeadlines()}
                                className="buttonStyle"
                            >
                                More
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
