import React from 'react';
import { connect } from 'react-redux';
import { saveWallPost, getWallPosts } from '../actions';

class WallPost extends React.Component {
    constructor(props){
        super(props);
        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.content;
    }
    componentDidMount(){
        this.props.dispatch(getWallPosts(this.props.userId));
    }
    onKeyPressed(e){
        if(e.target.name != "submit") this.content = e.target.value;

        if (e.which == 13 && !e.shiftKey || e.target.name == "submit"){
            this.handleSubmit();
            e.target.value = null;
            e.preventDefault();
        }
    }
    handleSubmit(){
        let data = {
            message: this.content,
            userId: this.props.userId,
            authorId: this.props.author.id,
            first_name: this.props.author.first_name,
            last_name: this.props.author.last_name,

        };
        this.props.dispatch(saveWallPost(data))
    }
    render(){
        const {wallPosts} = this.props;
        return(
            <div className="wall">
                <h3>The Wall</h3>
                <textarea onKeyUp={this.onKeyPressed} placeholder="Type your stuff"></textarea>
                <button  name="submit" onClick={this.onKeyPressed}>POST</button>
                <div className="posts">
                    { wallPosts &&
                        wallPosts.map((w,index)=>(
                            <div className="post" key={index}>
                                <p>{w.first_name} {w.last_name}</p>
                                <p>{w.created_at}</p>
                                <p>{w.message}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

        );
    }
}

const mapStateToProps = state => {
    return{
        wallPosts: state.wallPosts && state.wallPosts
    };
};

export default connect(mapStateToProps)(WallPost);
