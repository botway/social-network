import React from 'react';

const Logout = () => {
    return(
        <form action="/logout" method="post">
            <button type="submit">LOGOUT</button>
        </form>
    );
};

export default Logout;
