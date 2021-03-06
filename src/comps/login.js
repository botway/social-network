import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.complete = false;

        this.forms = {
            email: "",
            password: ""
        };

        this.state = {
            message: "Please, login.",
            error: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.forms[event.target.name] = event.target.value;
    }

    handleSubmit(event){

        for (let el of Object.keys(this.forms)){
            if(!this.forms[el]){
                this.complete = false;
                break;
            } else {
                this.complete = true;
            }
        }

        if(!this.complete){
            this.setState({
                message: "Please, fill out all fields."
            });
            return;

        } else {
            axios.post( "/login", this.forms).then( results => {
                if ( results.data.success ){
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                        message: results.data.message
                    });
                }
            });
        }
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <p>{ this.state.message }</p>
                <input type="email" name="email"
                    onChange={ this.handleChange }
                    placeholder="Email"/>
                <input type="password" name="password"
                    onChange={ this.handleChange }
                    placeholder="Password"/>
                <br/>
                <button type="button" onClick={ this.handleSubmit }>LOG IN</button>
                <p>Not a member? <Link to="/">Register</Link></p>
            </div>
        );
    }
}
