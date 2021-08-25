import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { socket } from "./socket.js";

export default function Feed() {
    const headlines = useSelector((state) => state.headlines);

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
            second: "numeric",
            hour12: false,
        };
        d = new Intl.DateTimeFormat("en-US", options).format(d).toString();
        return d;
    };

    const moreHeadlines = async () => {
        let newArr = [];
        for (let i = 0; i < headlines.length; i++) {
            newArr.push(headlines[i].id);
        }
        let lowest = newArr.sort((a, b) => a - b)[0];
        console.log(lowest);

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
        } catch (err) {
            console.log("Err in getting more headlines", err);
        }
    };

    return (
        <>
            <h3>Feed</h3>
            <div>
                {!headlines.length ? (
                    <div>No messages in the feed yet</div>
                ) : (
                    <>
                        <div>
                            {headlines.map((headline, index) => (
                                <div key={index}>
                                    <div>
                                        <Link to={`/case/${headline.id}`}>
                                            {headline.first} {headline.last}
                                        </Link>
                                    </div>
                                    <div>
                                        Published on{" "}
                                        <span>
                                            {dateConverter(headline.timestamp)}
                                        </span>
                                    </div>
                                    <div>
                                        SHORT TEXT SENT BY USER:{" "}
                                        {headline.headline}{" "}
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => moreHeadlines()}>
                                More
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
