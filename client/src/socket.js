export let socket;
import { io } from "socket.io-client";
import { draftReceived, deleteDraft } from "./redux/draftreports/slice.js";
import {
    headlinesReceived,
    headlineReceived,
} from "./redux/headlines/slice.js";

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }

    socket.on("lastHeadlines", (data) => {
        store.dispatch(headlinesReceived(data));
    });

    socket.on("updateHeadlines", (data) => {
        store.dispatch(headlineReceived(data));
    });

    socket.on("updateDrafts", (data) => {
        store.dispatch(draftReceived(data));
    });

    socket.on("updateDraftsWDelete", (data) => {
        store.dispatch(deleteDraft(data));
    });

    socket.on("updateEditedDraft", (data) => {
        store.dispatch(draftReceived(data));
    });
};
