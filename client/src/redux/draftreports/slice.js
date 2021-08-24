import axios from "axios";

export default function draftReducer(state = [], action) {
    if (action.type == "drafts/receivedDrafts") {
        state = action.payload.receivedDrafts;
    }
    if (action.type === "drafts/newReceived") {
        state = [...action.payload.draft, ...state];
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
