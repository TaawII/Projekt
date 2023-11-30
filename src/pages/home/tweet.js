import React, { useContext, useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import './tweet.css';
import { Avatar, Button } from "@mui/material"
import { addNewPost } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';

function OpublikujForm() {
  const { currentUser } = useContext(AuthContext);
  const [PostTresc, setPostTresc] = useState('');
  const [userPhotoURL, setUserPhotoURL] = useState('');

  const handleChange = (event) => {
    setPostTresc(event.target.value);
  };

  useEffect(() => {
    const storage = getStorage();
    const avatarRef = ref(storage, currentUser.uid + '.png');

    getDownloadURL(avatarRef)
      .then((url) => {
        setUserPhotoURL(url); 
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania avatara z Firebase Storage:', error);
      });
  }, [currentUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newPostData = {
      UID: currentUser.uid,
      Pseudonim: currentUser.displayName,
      Tresc: PostTresc,
      Timestamp: new Date(),
    };

    if (addNewPost('wpisy', newPostData)) {
      setPostTresc('');
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="tweet_pole">
          <Avatar alt={currentUser.displayName} src={userPhotoURL} /> {/* Wyświetlanie zdjęcia profilowego użytkownika */}
          <input id='SendText' placeholder="Co słychać?" type="text" value={PostTresc} onChange={handleChange} />
          <Button type="submit" id="SendPost" className="tweet_przycisk">Opublikuj</Button>
        </div>
      </form>
    </div>
  );
}

function Tweet() {
  return (
    <div className="tweet">
      <OpublikujForm />
    </div>
  );
}

export default Tweet;
