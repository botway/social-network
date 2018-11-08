import React from 'react';
import WallPost from './wallpost'

const Home = function(props){
    return (
        <div className="home">
            <WallPost user={props.user} />
        </div>
    );
};

export default Home;
