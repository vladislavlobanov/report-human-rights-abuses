import { socket } from "./socket.js";

export default function InfoCard({ drafts, showButton, handleEdit }) {
    const handleDelete = (e, draftId) => {
        e.preventDefault();
        socket.emit("deleteDraft", draftId);
    };

    return (
        <>
            <h3>Info Cards</h3>
            {drafts.map((draft) => (
                <div key={draft.id}>
                    <div>Who: {draft.who}</div>
                    <div>What: {draft.what}</div>
                    <div>When: {draft.whenhappened}</div>
                    <div>Where: {draft.wherehappened}</div>
                    <div>
                        Exact location: {draft.longitude}, {draft.latitude}
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
