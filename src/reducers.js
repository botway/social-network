export default function( state = {}, action ) {
    if (action.type == 'RECEIVE_FRIENDS_AND_WANNABES'){
        return {
            ...state,
            friendsAndWannabes: action.friendsAndWannabes
        };
    } else if (action.type == 'ACCEPT_FRIEND_REQUEST'){
        return {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.map(
                friend => {
                    if(friend.id == action.id){
                        return {
                            ...friend,
                            accepted: true
                        }
                    } else {
                        return friend;
                    }
                }
            )
        };
    } else if (action.type == 'UNFRIEND'){
        return {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.filter(
                friend => (friend.id != action.id )
            )
        };
    }
}
