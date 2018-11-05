import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    onlineUsers,
    userJoined,
    userLeft
} from '../actions';

class Onliners extends React.Component {

    render(){
        const { onliners, dispatch } = this.props;
        if (!onliners) {
            return null;
        }
        return(
            <div className="onliners">
                <h3>These are onlines</h3>
                { onliners.map ( friend => (
                    <div className="friend" key={ friend.id }>
                        <Link to={`/user/${friend.id}`} ><img src={ friend.image || "../assets/farmer.svg" }/></Link>
                        <span>
                            <div>{ friend.first_name } { friend.last_name }</div>
                        </span>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = state => {
    if(state){
        return {onliners: state.onlineUsers};
    } else {
        return {state};
    }
};

export default connect(mapStateToProps)(Onliners);
