import React from 'react';

const UserPic = function(props){
    const img = props.imgurl || "../assets/farmer.svg";
    return (
        <img className="userPic"
            src={ img }
            alt={`${props.first_name} ${props.last_name}`}
        />
    );
};

export default UserPic;
