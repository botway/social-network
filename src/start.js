import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './comps/welcome';
import Logo from './comps/logo';

let comp;

if (location.pathname == "/"){
    comp = <Logo url="../assets/bones.png"/>;
} else if (location.pathname == "/welcome"){
    comp = <div id="container"><Welcome logo="../assets/bones.png"/></div>;
}


ReactDOM.render(
    comp,
    document.querySelector('main')
);
