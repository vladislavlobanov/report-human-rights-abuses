export let socket;
import { io } from "socket.io-client";
import { draftReceived, deleteDraft } from "./redux/draftreports/slice.js";
import {
    headlinesReceived,
    headlineReceived,
    updatedSetHeadlinesReceived,
} from "./redux/headlines/slice.js";

import { casesReceived, caseReceived } from "./redux/cases/slice.js";

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }

    socket.on("lastHeadlinesEmit", (data) => {
        store.dispatch(headlinesReceived(data));
    });

    socket.on("myCasesEmit", (data) => {
        console.log(data);
        store.dispatch(casesReceived(data));
    });

    socket.on("myNewCaseEmit", (data) => {
        store.dispatch(caseReceived([data]));
    });

    socket.on("updateHeadlines", (data) => {
        store.dispatch(headlineReceived(data));
    });

    socket.on("updateHeadlinesWNewSet", (data) => {
        store.dispatch(updatedSetHeadlinesReceived(data));
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
