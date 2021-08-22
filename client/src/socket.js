export let socket;
import { io } from "socket.io-client";

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
};
