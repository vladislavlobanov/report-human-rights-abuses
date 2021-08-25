import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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

    return (
        <>
            <h3>Feed</h3>
            <div>
                {!headlines.length ? (
                    <div>No messages in the feed yet</div>
                ) : (
                    <>
                        <div className="chatContainer">
                            {headlines.map((headline, index) => (
                                <div className="messageCard" key={index}>
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
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
