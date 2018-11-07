export default function( state = {}, action ) {
    if (action.type == 'RECEIVE_FRIENDS_AND_WANNABES'){
        state = {
            ...state,
            friendsAndWannabes: action.friendsAndWannabes
        };
    }
    if (action.type == 'ACCEPT_FRIEND_REQUEST'){
        state = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.map(
                friend => {
                    if(friend.id == action.id){
                        return {
                            ...friend,
                            accepted: true
                        };
                    } else {
                        return friend;
                    }
                }
            )
        };
    }
    if (action.type == 'UNFRIEND'){
        state = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.filter(
                friend => (friend.id != action.id )
            )
        };
    }
    if (action.type == 'ONLINE_USERS'){
        state = {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }
    if (action.type == 'USER_LEFT'){
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                user => (user.id != action.user.id)
            )
        };
    }
    if (action.type == 'USER_JOINED'){
        state = {
            ...state,
            onlineUsers: state.onlineUsers.concat(
                action.user
            )
        };
    }
    if (action.type == 'STORED_CHAT_MESSAGES'){
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }
    if (action.type == 'NEW_CHAT_MESSAGE'){
        state = {
            ...state,
            chatMessages: state.chatMessages.concat(
                action.message
            )
        };
    }
    if (action.type == 'SEARCH_USERS'){
        state = {
            ...state,
            searchResults: action.val
        };
    }
    return state;
}
