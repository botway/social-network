import * as io from 'socket.io-client';
import { onlineUsers, userJoined, userLeft } from "./actions";
let socket;

export function initSocket(store){
    
    if(!socket) {
        socket = io.connect();

        socket.on("onlineUsers", (data)=>{
            store.dispatch(onlineUsers(data));
        });

        socket.on("userJoined", (user) => {
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", (user) => {
            store.dispatch(userLeft(user));
        });
    }
    return socket;
}
