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
            Imie: 'Imie',
            Pseudonim: currentUser.displayName,
            Tresc: this.state.PostTresc,
            Timestamp: new Date(),
          };
      addNewPost('wpisy', newPostData);
      alert('Dodano wpis: ' + this.state.PostTresc);
      this.setState({ PostTresc: ''});
      event.preventDefault();
    }
  
    render() {
      return (
        <div>
            {}
            <form onSubmit={this.handleSubmit} autoComplete="off">
                <div className="tweet_pole">
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    <input id='SendText' placeholder="Co słychać?" type="text" value={this.state.PostTresc} onChange={this.handleChange}/>
                </div>
                <Button type="submit" id="SendPost" className="tweet_przycisk">Opublikuj</Button>
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