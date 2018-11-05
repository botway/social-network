import React from 'react';

const Nav = () => {
    const style = {
        display: "inline-block",
        verticalAlign: "top",
        marginTop: "0",
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)"

    };
    const btnStyle = {
        marginTop: "0"
    };
    return(
        <form style={style}>
            <button formAction="/logout"
                formMethod="post"
                style={btnStyle}
                type="submit">LOGOUT
            </button>
            <button formAction="/friends"
                formMethod="get"
                style={btnStyle}
                type="submit">FRIENDS
            </button>
            <button formAction="/"
                formMethod="get"
                style={btnStyle}
                type="submit">PROFILE
            </button>
            <button formAction="/online"
                formMethod="get"
                style={btnStyle}
                type="submit">ONLINE
            </button>
        </form>
    );
};

export default Nav;
