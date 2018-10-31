import React from 'react';
import axios from './axios';

export default class Friendship extends React.Component {
    constructor(props){
        super(props);
        this.friendshipId;
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
            this.friendshipId = results.data.id;
            let status;
            if(!results.data){
                status = "Request friendship";
            } else if (!results.data.accepted &&
                this.props.receiver_id == results.data.sender_id ){
                status = "Accept friendship";
            } else if (!results.data.accepted &&
                this.props.receiver_id == results.data.receiver_id ) {
                status = "Cancel friend request";
            } else {
                status = "End friendship";
            }
            this.setState({
                status : status
            });
        }).catch(err => console.log(err.message));
    }

    friendship(){
        if(this.state.status == "Request friendship"){
            axios.get("/reqfriendship",{
                params:{
                    receiver_id: this.props.receiver_id
                }
            }).then(results => {
                this.friendshipId = results.data.id;
                if(!results.data.accepted){
                    this.setState({
                        status : "Cancel friend request"
                    });
                }
            }).catch(err => console.log(err.message));
        } else if (this.state.status == "Accept friendship"){
            axios.post("/acceptfriendship",{
                receiver_id: this.props.receiver_id
            }).then(results => {
                if(results.data.accepted){
                    this.setState({
                        status : "You are friends"
                    });
                }
            }).catch(err => console.log(err.message));
        } else if (this.state.status == "End friendship" ||
            this.state.status == "Cancel friend request"){
            axios.post("/endfriendship",{
                id: this.friendshipId
            }).then(() => {
                this.setState({
                    status : "Request friendship"
                });
            }).catch(err => console.log(err.message));
        }
    }

    render(){
        return(
            <button onClick={this.friendship}>{this.state.status}</button>
        );
    }
}
