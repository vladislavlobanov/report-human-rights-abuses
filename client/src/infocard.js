import { socket } from "./socket.js";
import SmallMap from "./smallmap";
const secrets = require("../../server/secrets.json");
import { Link } from "react-router-dom";
import { useState } from "react";

import MailTo from "./mailto";

export default function InfoCard({
    drafts,
    showButton,
    handleEdit,
    standalone,
    userDetails,
    inEdit,
}) {
    const handleDelete = (e, draftId) => {
        e.preventDefault();
        socket.emit("deleteDraft", draftId, false, inEdit);
    };

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

    if (!drafts) {
        return null;
    }

    return (
        <>
            <h2 className={standalone ? "h2Padding" : ""}>Case Details</h2>
            <div className={standalone ? "caseDetailsAlone" : "caseDetails"}>
                {drafts.length == 0 && (
                    <div>You have not submitted any drafts</div>
                )}
                {standalone && (
                    <>
                        {userDetails.map((headline, index) => (
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
                            </div>
                        ))}{" "}
                    </>
                )}

                {drafts.map((draft) => (
                    <div key={draft.id} className="caseCard">
                        <div
                            className={
                                standalone
                                    ? "fiveQuestionsAlone"
                                    : "fiveQuestions"
                            }
                        >
                            <div>
                                <span className="makeBold">Who: </span>{" "}
                                {draft.who}
                            </div>
                            <div>
                                <span className="makeBold">What:</span>{" "}
                                {draft.what}
                            </div>
                            <div>
                                <span className="makeBold">When:</span>{" "}
                                {dateConverter(draft.whenhappened)}
                            </div>
                            <div>
                                <span className="makeBold">Why:</span>{" "}
                                {draft.why}
                            </div>
                            <div>
                                <span className="makeBold">Where:</span>{" "}
                                {draft.wherehappened}
                            </div>
                        </div>

                        <div
                            className={
                                standalone ? "smallMapAloneCont" : "smallMap"
                            }
                        >
                            <div className="smallMapAlone">
                                <SmallMap
                                    mapboxApiAccessToken={secrets.mapbox}
                                    center={[
                                        Number(draft.longitude),
                                        Number(draft.latitude),
                                    ]}
                                    receivedPin={{
                                        longitude: Number(draft.longitude),
                                        latitude: Number(draft.latitude),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="buttons">
                            {showButton && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            handleEdit(e, {
                                                id: draft.id,
                                                who: draft.who,
                                                what: draft.what,
                                                wherehappened:
                                                    draft.wherehappened,
                                                when: draft.whenhappened,
                                                longitude: draft.longitude,
                                                latitude: draft.latitude,
                                                why: draft.why,
                                            });
                                        }}
                                    >
                                        EDIT
                                    </button>
                                    <button
                                        onClick={(e) =>
                                            handleDelete(e, draft.id)
                                        }
                                    >
                                        DELETE
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
