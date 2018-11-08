import axios from './comps/axios';
import {CancelToken} from './comps/axios';
let cancel;

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get('/getfriends');
    return {
        type: 'RECEIVE_FRIENDS_AND_WANNABES',
        friendsAndWannabes: data
    };
}

export async function accept(id) {
    await axios.post('/acceptfriendship', { receiver_id: id });
    return {
        type: 'ACCEPT_FRIEND_REQUEST',
        id
    };
}

export async function unfriend(id) {
    await axios.post('/endfriendship', { receiver_id: id });
    return {
        type: 'UNFRIEND',
        id
    };
}

export function onlineUsers (users) {
    return {
        type: 'ONLINE_USERS',
        onlineUsers: users
    };
}

export function userJoined (user) {
    return {
        type: 'USER_JOINED',
        user
    };
}

export function userLeft (user) {
    return {
        type: 'USER_LEFT',
        user
    };
}

export function storedChatMessages (data) {
    return {
        type: 'STORED_CHAT_MESSAGES',
        chatMessages: data
    };
}

export function newChatMessage (data) {
    return {
        type: 'NEW_CHAT_MESSAGE',
        message: data
    };
}
export async function getWallPosts (id) {
    const result = await axios.get("/getwallposts",{
        params: {userId: id}
    });
    return {
        type: 'GET_WALL_POSTS',
        val: result.data
    };
}

export function saveWallPost (data) {
    axios.post("/savewallpost", {data})
    return {
        type: 'SAVE_WALL_POST',
        val: data
    };
}


export function searchUsers (string) {
    let blank = {};
    if (cancel != undefined) {
        cancel();
        console.log("req was canceled");
    }
    if(string) return axios.get("/searchusers", {
        cancelToken: new CancelToken(function executor(c) {
            cancel = c;
        }),
        params: {
            searchStr: string.toLowerCase()
        }
    })
        .then(response => {
            return {
                type: 'SEARCH_USERS',
                val: response.data
            };
        })
        .catch(error => {
            const result = error.response;
            return Promise.reject(result);
        });

    if(!string) return {
        type: 'SEARCH_USERS',
        val: blank.data
    };
}

// no cancelation
// export async function searchUsers (string) {
//     let results = {};
//     if(string){
//         results = await axios.get('/searchusers', {params:
//             {searchStr: string.toLowerCase()}});
//     }
//     return {
//         type: 'SEARCH_USERS',
//         val: results.data
//     };
// }
