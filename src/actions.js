import axios from './comps/axios';
const CancelToken = axios.CancelToken;
// const source = CancelToken.source();
// console.log(source);

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

export async function searchUsers (string) {
    let results = {};
    if(string){
        results = await axios.get('/searchusers', {params:
            {searchStr: string.toLowerCase()}});
    }
    return {
        type: 'SEARCH_USERS',
        val: results.data
    };

}
