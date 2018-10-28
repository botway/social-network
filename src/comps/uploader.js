import React from 'react';
import axios from './axios';

export default class Uploader extends React.Component {
    constructor(props){
        super(props);
        this.imgId = null;
        this.state = {};
        this.handleFileChange = this.handleFileChange.bind(this);
        this.upload = this.upload.bind(this);
        this.cancelImg = this.cancelImg.bind(this);
        this.setImg = this.setImg.bind(this);
    }

    handleFileChange(e){
        this.file = e.target.files[0];
        this.upload();
    }

    upload(){
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("uid", this.props.userId);
        axios.post("/upload", formData).then( results => {
            this.imgId = results.data.id;
            this.setState({
                imgUrl: results.data.url
            });
        });
    }

    setImg(){
        this.props.onImgUploaded(this.state.imgUrl);
    }

    cancelImg(){
        axios.post("/deleteimg", {id: this.imgId,
            imgUrl: this.state.imgUrl}).then(() => {
            this.imgId = null;
            this.setState({
                imgUrl: undefined
            });
        });
    }

    render(){
        return(
            <div>
                <div className="overlay"></div>
                <div className="uploader">
                    <button onClick={ this.props.onClose } className="close" >X</button>
                    <h3>CHANGE PROFILE PIC</h3>
                    { this.state.imgUrl &&
                    <div>
                        <img src={ this.state.imgUrl } />
                        <br/>
                        <button type="button" className="button"
                            onClick={ this.cancelImg } >CANCEL</button>
                        <button type="button" className="button"
                            onClick={ this.setImg } >OK</button>
                    </div>
                    }
                    { !this.state.imgUrl &&
                    <div>
                        <input id="file"  type="file"
                            accept="image/*"
                            name="file"
                            onChange={ this.handleFileChange }
                        />
                        <label htmlFor="file">+ UPLOAD IMAGE</label>
                        <br/>
                    </div>
                    }
                </div>
            </div>
        );
    }

}
