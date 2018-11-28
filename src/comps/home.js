import React from 'react';
import WallPost from './wallpost'

const Home = function(props){
    console.log(props.user);
    return (
        <div className="home">
            <WallPost author={props.user} userId={props.user.id} />
        </div>
    );
};

export default Home;
