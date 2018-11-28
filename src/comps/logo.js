import React from 'react';
const imgUrl = "../assets/bones.svg";


const Logo = (props) => {
    let size;
    if(props.small){
        size = "4.2em";
    } else if (props.medium) {
        size = "7em";
    } else if (props.large) {
        size = "9em";
    } else {
        size = "5em";
    }
    const style = {
        width: size,
        display: "inline-block"
    };
    return(
        <img style={style} src={imgUrl} alt="logo"/>
    );
};

export default Logo;
