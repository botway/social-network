import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.complete = false;

        this.forms = {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        };

        this.state = {
            message: "Please, register.",
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
        console.log(this.complete);
        if(!this.complete){
            this.setState({
                message: "Please, fill out all fields."
            });
            return;
        } else {
            axios.post( "/register", this.forms ).then( results=>{
                if ( results.data.success ){
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                        message: "Something went wrong."
                    });
                }
            });
        }
        event.preventDefault();
    }

    render() {
        return (
            <div id="register">
                <p>{ this.state.message }</p>
                <input type="text" name="firstName"
                    onChange= { this.handleChange }
                    placeholder="First Name"/>
                <input type="text" name="lastName"
                    onChange={ this.handleChange }
                    placeholder="Last Name"/>
                <br/>
                <input type="email" name="email"
                    onChange={ this.handleChange }
                    placeholder="Email"/>
                <input type="password" name="password"
                    onChange={ this.handleChange }
                    placeholder="Password"/>
                <br/>
                <button type="button" onClick={ this.handleSubmit }>SUBMIT</button>
                <p>Already a member? <Link to="/login">Log in</Link></p>
            </div>
        );
    }
}
