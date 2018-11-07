import React from 'react';
import UserPic from './userpic';

const ProfilePic = function(props){
    let pos;
    if(props.left){
        pos = "left";
    } else if (props.right) {
        pos = "right";
    }

    const style = {
        float: pos
    };
    return (
        <div className="profilePic"
            onClick={ props.clickHandler }
            style={style} >
            <UserPic {...props} />
        </div>
    );
};

export default ProfilePic;
