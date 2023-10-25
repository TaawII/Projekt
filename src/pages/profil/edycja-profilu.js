import React, { useContext, useEffect, useState } from 'react';
import './edycja-profilu.css';
import { AuthContext } from '../../context/AuthContext';
import { uploadAvatar } from "../../firebase"; 
import Image from './img/avatar_default.jpg';
import BackgroundImage from './img/bg_user_default.jpg'

function EdycjaProfilu () {
    const { currentUser } = useContext(AuthContext);
    const [ photo, setPhoto ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ photoURL, setPhotoURL ] = useState(Image);

    function handleChange(e) {
      if (e.target.files[0]) {
        setPhoto(e.target.files[0])
      }
    }

    function handleClick() {
      uploadAvatar(photo, currentUser, setLoading); 
    }

    useEffect(() => {
      if (currentUser && currentUser.photoURL) {
        currentUser.reload().then(() => { 
          setPhotoURL(currentUser.photoURL);
      });
    }
    }, [currentUser])

    return (
        <div className="infoProfil">

          <div className="naglowek">
            <h2>Strona profilowa</h2>
          </div>

          <div className="tloProfilu">
            {/* miejsce na zmiane tla profilu przez uzytkownika */}
            <img src={BackgroundImage} alt="BackgroundUserProfile" className="tloProfilu"/>
          </div>

          <div className="info">
            <img src={photoURL} alt="Avatar" className="avatar" />
            <span className="displayName">{currentUser.displayName}</span><br></br>
            <input type="file" onChange={handleChange}></input>
            <button disabled={loading || !photo} onClick={handleClick}>Wyślij</button>
          </div>
        </div>
      );
}

export default EdycjaProfilu;