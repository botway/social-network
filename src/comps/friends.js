import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import {
    receiveFriendsAndWannabes,
    accept,
    unfriend
} from '../actions';


class Friends extends React.Component {
    componentDidMount(){
        this.props.dispatch(receiveFriendsAndWannabes());
    }
    visitProfile(e){
        // this.props.history.push(`/user/:'${id}`)
        console.log("vis", e.target);
    }
    render(){
        const { friends, wannabes, dispatch } = this.props;
        if (!friends && !wannabes) {
            return null;
        }
        return(
            <div className="friends">
                <h3>Friends</h3>
                { friends.map( friend => (
                    <div className="friend" key={ friend.id }>
                        <Link to={`/user/${friend.id}`} ><img src={ friend.image || "../assets/farmer.svg" }/></Link>
                        <span>
                            <div>{ friend.first_name } { friend.last_name }</div>
                            <button onClick={() => dispatch(unfriend(friend.id))}>Unfriend</button>
                        </span>
                    </div>
                ))}
                <h3>Wannabes</h3>
                { wannabes.map( wannabe => (
                    <div className="friend" key={ wannabe.id }>
                        <Link to={`/user/${ wannabe.id }`} ><img src={ wannabe.image || "../assets/farmer.svg" }/></Link>
                        <span>
                            <div>{ wannabe.first_name } { wannabe.last_name }</div>
                            <button onClick={() => dispatch(accept(wannabe.id))}>
                                Accept friendship</button>
                        </span>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = state => {
    if(state){
        return {
            friends: state.friendsAndWannabes.filter(
                f => f.accepted
            ),
            wannabes: state.friendsAndWannabes.filter(
                w => !w.accepted
            )
        };
    } else {
        return {};
    }
};

export default connect(mapStateToProps)(Friends);
