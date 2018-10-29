import React from 'react';

const ProfilePic = function(props){
    console.log(props);
    const img = props.imgurl || "../assets/farmer.svg";
    return (
        <img id="userPic"
            onClick={ props.clickHandler }
            src={ img }
            alt={`${props.first_name} ${props.last_name}`}
        />
    );
};

export default ProfilePic;
