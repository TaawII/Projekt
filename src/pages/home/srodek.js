import React, { useContext }  from 'react';
import "./srodek.css"
import Tweet from "./tweet"
import Post from "./post"
import { AuthContext } from '../../context/AuthContext';

function Srodek(){
    const { currentUser } = useContext(AuthContext);
    return(
        <div className="srodek">

        {/* naglowek */}
        <div className="srodek-naglowek">
            <h2>Witaj {currentUser.displayName}! </h2>
        </div>
        <Tweet/>
        <Post/>
        </div>
    );
}

export default Srodek;