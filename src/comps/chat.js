import React from 'react';
import { connect } from 'react-redux';
import { sendChatMessage } from '../socket';
import { newChatMessage } from '../actions';

class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    componentDidMount(){
    }

    componentDidUpdate(){
        ///scrolll stuff
    }

    onKeyPressed(e){
        if (e.which == 13 && !e.shiftKey){
            this.props.dispatch(newChatMessage({
                user: {
                    id: this.props.id,
                    first_name: this.props.first_name,
                    last_name: this.props.last_name,
                    image: this.props.imgurl
                },
                message: e.target.value
            }
            ));
            sendChatMessage(e.target.value);
            e.target.value = null;
            e.preventDefault();
        }
    }
    render(){
        const { chatMessages } = this.props;
        // if (!chatMessages) {
        //     return null;
        // }
        return(
            <div className="chat">
                <h3>The Chat</h3>
                <div className="chatMessages">
                    { chatMessages &&
                        chatMessages.map( m => (
                            <p key={m.user.id + m.message}>{m.message}</p>
                        ))
                    }
                </div>
                <textarea onKeyDown={this.onKeyPressed}></textarea>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        chatMessages: state.chatMessages && state.chatMessages
    };
};

export default connect(mapStateToProps)(Chat);
