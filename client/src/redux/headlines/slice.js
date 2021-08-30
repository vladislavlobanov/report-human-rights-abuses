export default function headlinesReducer(state = null, action) {
    if (action.type == "headlines/allreceived") {
        state = action.payload.headlines;
    }

    if (action.type === "headlines/newreceived") {
        state = state && [action.payload.headline, ...state];
    }

    if (action.type === "headlines/newSetReceived") {
        state = [...state, ...action.payload.newSet];
    }

    if (action.type === "headlines/moveOne") {
        state = state.filter((headline) => {
            return headline.id !== action.payload.headline.id;
        });
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

export function moveOneHeadline(headline) {
    return {
        type: "headlines/moveOne",
        payload: { headline },
    };
}

export function updatedSetHeadlinesReceived(newSet) {
    return {
        type: "headlines/newSetReceived",
        payload: { newSet },
    };
}
