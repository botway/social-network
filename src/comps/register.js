import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "Please, register.",
            error: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this[event.target.name] = event.target.value;
    }

    handleSubmit(event){
        for (let el of Object.keys(this.state)){
            if(this[el] == ""){
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
            axios.post( "/register",{
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
            }).then( results=>{
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
            <div>
                <p>{ this.state.message }</p>
                <input type="text" name="firstName"
                    onChange= { this.handleChange }
                    placeholder="First Name"/>
                <input type="text" name="lastName"
                    onChange={ this.handleChange }
                    placeholder="Last Name"/>
                <input type="email" name="email"
                    onChange={ this.handleChange }
                    placeholder="Email"/>
                <input type="password" name="password"
                    onChange={ this.handleChange }
                    placeholder="Password"/>
                <button type="button" onClick={ this.handleSubmit }>SUBMIT</button>
                <p>Already a member? <Link to="/login">Log in</Link></p>
            </div>
        );
    }
}
