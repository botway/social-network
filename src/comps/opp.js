import React from 'react';
import axios from './axios';
import Bio from './bio'

export default class Opp extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount(){
        axios.get("/userprofile",{
            params: { id: this.props.match.params.id }
        }).then( results => {
            if(results.data.redirect){
                this.props.history.push('/');
            } else {
                this.setState({
                    ...results.data
                });
            }
        }).catch(err => {
            console.log(err.message);
        });
    }

    render(){
        return(
            <div className="profile">
                <img src={this.state.imgurl || "../assets/farmer.svg"} />
                <div className="userInfo">
                    <p>{this.state.first_name} {this.state.last_name}</p>
                    <Bio bio={ this.state.bio } noedit={true}/>
                </div>
            </div>
        );
    }
}
