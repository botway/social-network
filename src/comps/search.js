import React from 'react';
import UserPic from './userpic';
import { connect } from 'react-redux';
import { searchUsers } from '../actions';
import { Link } from 'react-router-dom';

let cachedVal;
const wait = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
};

let style = {
    display: "inline-block"
};

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            search:""
        };
        this.handleChange = this.handleChange.bind(this);
        this.closeResults = this.closeResults.bind(this);
        this.timeoutID;
    }
    closeResults(){
        setTimeout(()=>{
            this.setState({
                search:""
            },()=>{
                this.props.dispatch(searchUsers(this.state.search));
            });
        },100);
    }
    async handleChange(e){
        this.setState({
            search:e.target.value
        });
        cachedVal = e.target.value;
        this.handleSubmit(cachedVal);
        // await wait(300);
        // this.setState({
        //     search: cachedVal
        // },()=>{
        //     this.props.dispatch(searchUsers(this.state.search));
        // });
    }
    async handleSubmit(data){
        await wait(300);
        this.props.dispatch(searchUsers(data));
    }
    render(){
        const {searchResults} = this.props;
        return(
            <div className="search">
                <input type="text" placeholder="find friends" value={this.state.search} onChange={this.handleChange}></input>
                {
                    searchResults &&
                    <div className="searchResults" style={style} onMouseUp={this.closeResults}>
                        {
                            searchResults &&
                                searchResults.map( (s,index) => (
                                    <div className="foundUser" key={index}>
                                        <Link to={`/user/${s.id}`} ><UserPic imgurl={s.image}/></Link>
                                        <Link to={`/user/${s.id}`} ><p>{s.first_name} {s.last_name}</p></Link>
                                    </div>
                                ))
                        }
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        searchResults: state.searchResults && state.searchResults
    };
};

export default connect(mapStateToProps)(Search);
