export default function casesReducer(state = null, action) {
    if (action.type == "cases/allreceived") {
        state = action.payload.cases;
    }

    if (action.type === "cases/newreceived") {
        state = [action.payload.newCase, ...state];
    }

    return state;
}

export function casesReceived(cases) {
    return {
        type: "cases/allreceived",
        payload: { cases },
    };
}

export function caseReceived(newCase) {
    return {
        type: "cases/newreceived",
        payload: { newCase },
    };
}
