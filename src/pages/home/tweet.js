import React, {useContext, createContext} from 'react';
import './tweet.css';
import { Avatar, Button } from "@mui/material"
import { addNewPost } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

class OpublikujForm extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
      super(props);
      this.state = {PostTresc: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({PostTresc: event.target.value});
    }
  
    handleSubmit(event) {
        const { currentUser } = this.context;
        var newPostData = {
            UID: currentUser.uid,
            Pseudonim: currentUser.displayName,
            Tresc: this.state.PostTresc,
            Timestamp: new Date(),
          };
        if(addNewPost('wpisy', newPostData))
        {
            window.location.reload(); 
        }
      this.setState({ PostTresc: ''});
      event.preventDefault();
    }
  
    render() {
      return (
        <div>
            <form onSubmit={this.handleSubmit} autoComplete="off">
                <div className="tweet_pole">
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    <input id='SendText' placeholder="Co słychać?" type="text" value={this.state.PostTresc} onChange={this.handleChange}/>
                <Button type="submit" id="SendPost" className="tweet_przycisk">Opublikuj</Button>
                </div>
            </form>
        </div>
      );
    }
  }

function Tweet(){
    return(
        <div className="tweet">
            <OpublikujForm />
        </div>
    );
}


export default Tweet;