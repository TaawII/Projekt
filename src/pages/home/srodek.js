import React from 'react';
import "./srodek.css"
import Tweet from "./tweet"
import Post from "./post"

function Srodek(){
    return(
        <div className="srodek">

        {/* naglowek */}
        <div className="srodek-naglowek">
            <h2>Sekcja wpisów</h2>
        </div>
        {/* miejsce do tweetowania */}

        <Tweet/>
        <Post/>
        {/* wpisy */}

        </div>
    );
}

export default Srodek;