import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './comps/welcome';
import App from './comps/app'

let comp;

if (location.pathname == "/"){
    comp = <App />;
} else if (location.pathname == "/welcome"){
    comp = <div id="container"><Welcome /></div>;
}


ReactDOM.render(
    comp,
    document.querySelector('main')
);
