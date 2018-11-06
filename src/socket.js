import * as io from 'socket.io-client';
import { onlineUsers, userJoined, userLeft, newChatMessage, storedChatMessages } from "./actions";
let socket;

export function initSocket(store){

    if(!socket) {
        socket = io.connect();

        socket.on("onlineUsers", data => {
            store.dispatch(onlineUsers(data));
        });

        socket.on("userJoined", user => {
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", user => {
            store.dispatch(userLeft(user));
        });

        socket.on("storedChatMessages", messages => {
            store.dispatch(storedChatMessages(messages))
        });

        socket.on("newChatMessage", data => {
            store.dispatch(newChatMessage(data));
        });
    }
    return socket;
}

export function sendChatMessage (data){
    socket.emit("chatMessage", data);
}
