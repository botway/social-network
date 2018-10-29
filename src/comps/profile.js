import React from 'react';
import Bio from './bio';

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.editBio = false;
        this.addBio = this.addBio.bind(this);
    }
    addBio(){
        this.edit.bio = true;
        this.props.setBio("");
    }
    render(){
        return(
            <div className="profile">
                <img src={this.props.imgurl} onClick={this.props.showUploader}/>
                <div className="userInfo">
                    <p>{this.props.first_name} {this.props.last_name}</p>
                    { this.props.bio != undefined
                        && <Bio bio={ this.props.bio }
                            setBio={this.props.setBio}
                            edit={this.editBio} />
                        || <button onClick={ this.addBio }>Add bio</button>
                    }
                </div>
            </div>
        );
    }
}
