import React from 'react';
import { connect } from 'react-redux';
import { sendChatMessage } from '../socket';
import { newChatMessage } from '../actions';

class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.user = {
            id: this.props.id,
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            image: this.props.imgurl
        };
    }

    componentDidMount(){
    }

    componentDidUpdate(){
        this.chat.scrollTop = this.chat.scrollHeight - this.chat.clientHeight;
    }

    onKeyPressed(e){
        if (e.which == 13 && !e.shiftKey){
            const data = {
                user: this.user,
                message: e.target.value
            };
            this.props.dispatch(newChatMessage(data));
            sendChatMessage(data);
            e.target.value = null;
            e.preventDefault();
        }
    }
    render(){
        const { chatMessages } = this.props;
        return(
            <div className="chat">
                <h3>The Chat</h3>
                <div className="chatMessages" ref={elem => (this.chat = elem)}>
                    { chatMessages &&
                        chatMessages.map( (m,index) => (
                            <div className="message" key={index}>
                                <img src={m.user.image} alt={m.user.last_name}/>
                                <strong>{m.user.first_name} {m.user.last_name}: </strong>
                                <span>{m.message}</span>
                            </div>
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
