import React from 'react';
import axios from './axios';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Logo from './logo';
import Logout from './logout';
import ProfilePic from './profilepic';
import Uploader from './uploader';
import Profile from './profile';
import Opp from  './opp';

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
        this.closeUploader = this.closeUploader.bind(this);
        this.editBio = false;
    }

    componentDidMount(){
        axios.get("/user").then( results => {
            this.setState({
                ...results.data
            });
        }).catch(err => {
            console.log(err.message);
        });
    }

    showUploader(){
        this.setState({
            uploaderIsVisible: true
        });
    }

    closeUploader(){
        this.setState({
            uploaderIsVisible: false
        });
    }

    setImage(imgUrl){
        this.setState({
            imgurl: imgUrl,
            uploaderIsVisible: false
        });
    }

    setBio(bio){
        if(!bio){
            this.editBio = true;
            this.setState({
                bio: ""
            });
        }else{
            if(this.state.bio != bio){
                axios.post("/savebio",{
                    id: this.state.id,
                    bio: bio
                }).then(results => {
                    console.log(results.data);
                }).catch(err => console.log(err.message));
                this.setState({
                    bio: bio
                });
            }
        }
    }

    render(){
        if(!this.state.id){
            return null;
        }
        return(
            <div>
                <ProfilePic
                    imgurl = { this.state.imgurl }
                    id = { this.state.id }
                    first_name = { this.state.first_name }
                    last_name = { this.state.last_name }
                    clickHandler ={ this.showUploader }
                />
                <Logo />
                <Logout />
                { this.state.uploaderIsVisible &&
                    <Uploader onImgUploaded = { this.setImage }
                        userId = { this.state.id }
                        onClose = { this.closeUploader }
                    />
                }
                <BrowserRouter>
                    <div>
                        <Route
                            exact path="/"
                            render={() => (
                                <Profile
                                    id = { this.state.id }
                                    first_name = { this.state.first_name }
                                    last_name = { this.state.last_name }
                                    imgurl = { this.state.imgurl }
                                    bio = { this.state.bio }
                                    editBio = { this.editBio }
                                    setBio = { this.setBio }
                                    showUploader = { this.showUploader }
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render = { props => (
                                <Opp {...props} key={ props.match.url }/>
                            )}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }

}
