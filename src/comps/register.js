import React from 'react';
import axios from 'axios';
let complete = false;

export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            message: "Please, register."
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]:event.target.value
        });
    }

    handleSubmit(event){
        for (let el of Object.keys(this.state)){
            if(this.state[el] == ""){
                complete = false;
                break;
            }else{
                complete = true;
            }
        }

        if(!complete){
            this.setState({
                message: "Please, fill out all fields."
            });
            return;
        } else {
            axios.post("/register",{
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
            }).then(results=>{
                if(results.data.success){
                    console.log("You are registered");
                    location.replace("/");
                    // axios.get("/");
                }else{
                    this.setState({
                        message: "Something went wrong!"
                    });
                }
            });
        }
        event.preventDefault();
    }

    render() {
        return (
            <form>
                <p>{this.state.message}</p>
                <input type="text" name="firstName"
                    value= {this.state.firstName}
                    onChange= {this.handleChange}
                    placeholder="First Name"/>
                <input type="text" name="lastName"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    placeholder="Last Name"/>
                <input type="email" name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    placeholder="Email"/>
                <input type="password" name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    placeholder="Password"/>
                <button type="button" onClick={this.handleSubmit}>SUBMIT</button>
            </form>
        );
    }
}
