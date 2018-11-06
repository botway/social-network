import axios from './comps/axios';

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get('/getfriends');
    return {
        type: 'RECEIVE_FRIENDS_AND_WANNABES',
        friendsAndWannabes: data
    };
}

export async function accept(id) {
    console.log("accept", id);
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
