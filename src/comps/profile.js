import React from 'react';
import Bio from './bio';
import ProfilePic from './profilepic'

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
                <h3>The Profile</h3>
                <ProfilePic left {...this.props} clickHandler={this.props.showUploader} />
                <h4>{this.props.first_name} {this.props.last_name}</h4>
                { this.props.bio != undefined
                    && <Bio bio={ this.props.bio }
                        setBio={ this.props.setBio }
                        edit={ this.props.editBio }
                        editbtn={true}
                    />
                    || <button onClick={ this.addBio }>Add bio</button>
                }
            </div>
        );
    }
}
