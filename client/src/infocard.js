import axios from "axios";
import { socket } from "./socket.js";

export default function InfoCard({ drafts, showButton }) {
    const handleDelete = (e, draftId) => {
        e.preventDefault();
        socket.emit("deleteDraft", draftId);
    };
    return (
        <>
            <h3>Info Cards</h3>
            {drafts.map((draft) => (
                <div key={draft.id}>
                    <div onClick={() => console.log(draft.id)}>
                        Who: {draft.who}
                    </div>
                    <div>What: {draft.what}</div>
                    <div>When: {draft.whenhappened}</div>
                    <div>
                        Where: {draft.longitude}, {draft.latitude}
                    </div>
                    <div>Why: {draft.why}</div>
                    {showButton && (
                        <>
                            <button onClick={(e) => handleDelete(e, draft.id)}>
                                DELETE
                            </button>
                            <button>EDIT</button>
                        </>
                    )}
                </div>
            ))}
        </>
    );
}
