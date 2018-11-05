import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './comps/welcome';
import App from './comps/app';

import { initSocket } from './socket';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './reducers';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));


let elem;
if (location.pathname == "/welcome"){
    elem =  <div id="container"><Welcome /></div>;
} else {
    elem = (
        initSocket(store),
        (
            <Provider store={store}>
                <App />
            </Provider>
        )
    );
}


ReactDOM.render(
    elem,
    document.querySelector('main')
);
