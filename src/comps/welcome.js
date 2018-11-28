import React from 'react';
import Register from './register';
import Login from './login';
import Logo from './logo';
import { HashRouter, Route } from 'react-router-dom';

const desc = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
const callToAction = "Sunt in culpa qui officia deserunt."

const Welcome = () => {
    return (
        <div id="welcome">
            <h1>WELCOME TO THE</h1>
            <Logo medium />
            <p>{desc}</p>
            <h2>{callToAction}</h2>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Register}/>
                    <Route path="/login" component={Login}/>
                </div>
            </HashRouter>
        </div>
    );
};

export default Welcome;
