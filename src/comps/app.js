import React from 'react';
import axios from './axios';
import Logo from './logo';
import Logout from './logout';
import ProfilePic from './profilepic';
import Uploader from './uploader';

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.closeUploader = this.closeUploader.bind(this);
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
                    />}
            </div>
        );
    }

}
