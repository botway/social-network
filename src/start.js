import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './comps/welcome';
import App from './comps/app'

let comp;

if (location.pathname == "/welcome"){
    comp = <div id="container"><Welcome /></div>;
} else {
    comp = <App />;
}


ReactDOM.render(
    comp,
    document.querySelector('main')
);
