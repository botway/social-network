import React from 'react';
import axios from './axios';

export default class Friendship extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            status: "Request friendship"
        };
        this.friendship = this.friendship.bind(this);
    }

    componentDidMount(){
        axios.get("/getfriendship",{
            params:{
                receiver_id: this.props.receiver_id
            }
        }).then(results => {
            let status;
            if(!results.data){
                status = "Request friendship";
            } else if (!results.data.accepted){
                status = "Friendship pending";
            } else {
                status = "Cancel friendship";
            }
            this.setState({
                status : status
            });
        }).catch(err => console.log(err.message));
    }

    friendship(){
        axios.get("/reqfriendship",{
            params:{
                receiver_id: this.props.receiver_id
            }
        }).then(results => {
            if(!results.data.accepted){
                this.setState({
                    status : "Friendship pending"
                });
            }
        }).catch(err => console.log(err.message));
    }

    render(){
        return(
            <button onClick={this.friendship}>{this.state.status}</button>
        );
    }
}
