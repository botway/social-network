import React from 'react';
import Register from './register';

const desc = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
const callToAction = "Sunt in culpa qui officia deserunt."

const Welcome = ({logo}) => {
    return (
        <div>
            <h1>Welcome to</h1>
            <img src={logo} alt="logo"/>
            <p>{desc}</p>
            <h2>{callToAction}</h2>
            <Register />
            <p>Already a member? <a href="#">Log in</a></p>
        </div>
    );
};

export default Welcome;
