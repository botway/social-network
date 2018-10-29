import React from 'react';

export default class Bio extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            edit: this.props.edit
        };
        this.bio = this.props.bio;
        this.handleChange = this.handleChange.bind(this);
        this.submitBio = this.submitBio.bind(this);
        this.editBio = this.editBio.bind(this);
    }

    handleChange(e){
        this.bio = e.target.value;
    }

    submitBio(){
        this.props.setBio(this.bio);
        this.setState({
            edit:false
        });
    }

    editBio(){
        this.setState({
            edit:true
        });
    }
    render(){
        if(this.state.edit == true){
            return(
                <div>
                    <textarea defaultValue={this.props.bio}
                        onChange={this.handleChange}
                    ></textarea>
                    <br/>
                    <button onClick={this.submitBio}>SAVE</button>
                </div>
            );
        }else{
            return(
                <div>
                    <p>{this.props.bio}</p>
                    <button onClick={this.editBio} >edit</button>
                </div>
            );
        }
    }
}
