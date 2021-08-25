export default function headlinesReducer(state = null, action) {
    if (action.type == "headlines/allreceived") {
        state = action.payload.headlines;
    }

    if (action.type === "headlines/newreceived") {
        state = [action.payload.headline, ...state];
    }
    return state;
}

export function headlinesReceived(headlines) {
    return {
        type: "headlines/allreceived",
        payload: { headlines },
    };
}

export function headlineReceived(headline) {
    return {
        type: "headlines/newreceived",
        payload: { headline },
    };
}
