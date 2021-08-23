export let socket;
import { io } from "socket.io-client";
import { draftReceived } from "./redux/draftreports/slice.js";

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("updateDrafts", (data) => {
        store.dispatch(draftReceived(data));
    });
};
