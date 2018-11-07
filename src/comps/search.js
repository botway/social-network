import React from 'react';
import UserPic from './userpic';
import { connect } from 'react-redux';
import { searchUsers } from '../actions';

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        this.setState({
            search: e.target.value
        },()=>{
            this.props.dispatch(searchUsers(this.state.search));    
        });
    }
    render(){
        const {searchResults} = this.props;
        return(
            <div className="search">
                <input type="text" placeholder="find friends" onChange={this.handleChange}></input>
                <div className="searchResults">
                    {
                        searchResults &&
                            searchResults.map( (s,index) => (
                                <div className="foundUser" key={index}>
                                    <UserPic imgurl={s.image}/>
                                    <p>{s.first_name} {s.last_name}</p>
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
        searchResults: state.searchResults && state.searchResults
    };
};

export default connect(mapStateToProps)(Search);
