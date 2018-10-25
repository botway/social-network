import React from 'react';
import Logout from './logout';

const Logo = ({url})=>{
    return(
        <div>
            <img src={url} alt="logo"/>
            <br/>
            <Logout />
        </div>
    );
};

export default Logo;
