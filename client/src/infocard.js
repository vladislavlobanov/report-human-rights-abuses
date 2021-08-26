import { socket } from "./socket.js";
import SmallMap from "./smallmap";
const secrets = require("../../server/secrets.json");

export default function InfoCard({ drafts, showButton, handleEdit }) {
    const handleDelete = (e, draftId) => {
        e.preventDefault();
        socket.emit("deleteDraft", draftId);
    };

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
            <h3>Info Cards</h3>
            {drafts.map((draft) => (
                <div key={draft.id}>
                    <div>Who: {draft.who}</div>
                    <div>What: {draft.what}</div>
                    <div>When: {dateConverter(draft.whenhappened)}</div>
                    <div>Where: {draft.wherehappened}</div>
                    <div>
                        Exact location: {draft.longitude}, {draft.latitude}
                    </div>
                    <div className="map">
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
                    <div>Why: {draft.why}</div>
                    {showButton && (
                        <>
                            <button onClick={(e) => handleDelete(e, draft.id)}>
                                DELETE
                            </button>
                            <button
                                onClick={(e) => {
                                    handleEdit(e, {
                                        id: draft.id,
                                        who: draft.who,
                                        what: draft.what,
                                        wherehappened: draft.wherehappened,
                                        when: draft.whenhappened,
                                        longitude: draft.longitude,
                                        latitude: draft.latitude,
                                        why: draft.why,
                                    });
                                }}
                            >
                                EDIT
                            </button>
                        </>
                    )}
                </div>
            ))}
        </>
    );
}
