import React from 'react';
import axios from './axios';

export default class Uploader extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.handleFileChange = this.handleFileChange.bind(this);
        this.upload = this.upload.bind(this);
    }

    handleFileChange(e){
        this.file = e.target.files[0];
    }

    upload(){
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("uid", this.props.userId);
        axios.post("/upload", formData).then( results => {
            console.log("results", results);
            this.props.onImgUploaded(results.data.url);
        });
    }

    render(){
        return(
            <div className="uploader">
                <h1>UPLOADER</h1>
                <input  type="file"
                    accept="image/*"
                    name="file"
                    onChange={ this.handleFileChange }
                />
                <button type="button" className="button"
                    onClick={ this.upload }
                >UPLOAD</button>
                <br/>
                <button onClick={ this.props.onClose }>X</button>
            </div>
        );
    }

}
