import axios from "axios";

export default function draftReducer(state = null, action) {
    if (action.type == "drafts/receivedDrafts") {
        state = action.payload.receivedDrafts;
    }
    if (action.type === "drafts/newReceived") {
        state = [...action.payload.draft, ...state];
        state = state.sort(
            (a, b) => new Date(b.whenhappened) - new Date(a.whenhappened)
        );
    }

    if (action.type === "drafts/deleteDraft") {
        state = state.filter((draft) => {
            return draft.id !== action.payload.id;
        });
    }

    return state;
}

export function receiveDrafts() {
    return async (dispatch) => {
        try {
            const { data: receivedDrafts } = await axios.get(`/getdrafts/`);
            dispatch({
                type: "drafts/receivedDrafts",
                payload: { receivedDrafts },
            });
        } catch (err) {
            console.log("Err in action creator receiveDrafts", err);
        }
    };
}

export function draftReceived(draft) {
    return {
        type: "drafts/newReceived",
        payload: { draft },
    };
}

export function deleteDraft(id) {
    // return {
    //     type: "drafts/deleteDraft",
    //     payload: { id },
    // };

    if (!id.inEdit) {
        return async (dispatch) => {
            try {
                let { data: receivedDrafts } = await axios.get(`/getdrafts/`);
                receivedDrafts = receivedDrafts.filter((draft) => {
                    return draft.id !== id.data;
                });

                dispatch({
                    type: "drafts/receivedDrafts",
                    payload: { receivedDrafts },
                });
            } catch (err) {
                console.log("Err in action creator receiveDrafts", err);
            }
        };
    } else {
        return async (dispatch) => {
            try {
                let { data: receivedDrafts } = await axios.get(`/getdrafts/`);
                receivedDrafts = receivedDrafts.filter((draft) => {
                    return draft.id !== id.inEdit;
                });

                dispatch({
                    type: "drafts/receivedDrafts",
                    payload: { receivedDrafts },
                });
            } catch (err) {
                console.log("Err in action creator receiveDrafts", err);
            }
        };
    }
}
