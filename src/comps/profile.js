import React from 'react';
import Bio from './bio';

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.addBio = this.addBio.bind(this);
    }
    addBio(){
        this.props.setBio("");
    }
    render(){
        return(
            <div className="profile">
                <img src={this.props.imgurl || "../assets/farmer.svg"} onClick={this.props.showUploader}/>
                <div className="userInfo">
                    <p>{this.props.first_name} {this.props.last_name}</p>
                    { this.props.bio != undefined
                        && <Bio bio={ this.props.bio }
                            setBio={ this.props.setBio }
                            edit={ this.props.editBio } />
                        || <button onClick={ this.addBio }>Add bio</button>
                    }
                </div>
            </div>
        );
    }
}
