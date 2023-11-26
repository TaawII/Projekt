import React, { useContext, useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../../context/AuthContext';
import DefaultBackgroundImage from './img/bg_user_default.jpg';
import Image from './img/avatar_default.jpg';
import { useParams } from "react-router-dom";
import { getProfileDescription } from '../../firebase';
import { getUserName, addFollow, checkFollow } from '../../firebase';
import UserPostsFetcher from './posts.js';
import './pokaz-profil.css';
import SpatialTrackingIcon from '@mui/icons-material/SpatialTracking';
import MessageIcon from '@mui/icons-material/Message';

function PokazProfil() {
  const { userUID } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [userPhotoURL, setUserPhotoURL] = useState(currentUser.photoURL || Image);
  const [backgroundImage, setBackgroundImage] = useState(DefaultBackgroundImage);
  const [userName, setuserName] = useState();
  const [description, setDescription] = useState(''); // Dodaj stan opisu użytkownika
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isFollow, setIsUserFollow] = useState(false);


  const storage = getStorage();
  const avatarStorageRef = ref(storage, userUID + '.png');
  const backgroundStorageRef = ref(
    storage,
    userUID + '_background.jpg'
  );

    const handleAddFollow = async () => {
      var x = await addFollow(currentUser.uid, userUID);
      if(x)
      setIsUserFollow(x);
    };

  const handleRemoveFollow = async () => {
    var x = await addFollow(currentUser.uid, userUID);
    if(x)
    setIsUserFollow(false);
  };


  useEffect(() => {
    getDownloadURL(avatarStorageRef)
      .then((url) => {
        setUserPhotoURL(url);
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania avatara:', error);
      });

    getDownloadURL(backgroundStorageRef)
      .then((url) => {
        setBackgroundImage(url);
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania tła:', error);
      });

    const fetchData = async () => {
      const result = await checkFollow(currentUser.uid, userUID);
      setIsUserFollow(result);
    };
    fetchData();
  }, [userUID, currentUser.uid]);

  useEffect(() => {
    getProfileDescription(userUID)
      .then((userDescription) => {
        setDescription(userDescription);
        setIsUserDataLoaded(true);
      });
  }, [userUID]);

  useEffect(() => {
    getUserName(userUID)
      .then((userData) => {
        if (userData.length > 0) {
          const user = userData[0]; 
          setuserName(user.UserName);
          setIsUserDataLoaded(true);
        } else {
          console.log('Nie znaleziono użytkownika.');
          setIsUserDataLoaded(true);
        }
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        setIsUserDataLoaded(true);
      });
  }, [userUID]);
  


  return (
    <div className="infoProfil">
      <div className="tloProfilu">
        <div className="background-image-container">
          {backgroundImage && (
            <img
              src={backgroundImage}
              alt="BackgroundImage"
              className="tloProfilu"
            />
          )}
        </div>
      </div>
      <div className="info">
        <img
          src={userPhotoURL}
          alt="Avatar"
          className="avatar"
        />
        <span className="displayName">{userName}</span>
        <br/>
        <div className="inner">
          {isFollow?
            (
              <button className="followButton" onClick={handleRemoveFollow}><h2><SpatialTrackingIcon className="followIcon"/>Przestan Obserwowac</h2></button>
            ):(
              <button className="followButton" onClick={handleAddFollow}><h2><SpatialTrackingIcon className="followIcon"/>Obserwuj</h2></button>
            )
          }
        <button className="sendMsgButton"><h2><MessageIcon className="sendMsgIcon"/>Wyślij wiadomość</h2></button>
        </div>
        <br></br>
        {isUserDataLoaded ? (
          <div>
            <span className="userDescription">
              {description || 'Dodaj opis...'}
            </span>
          </div>
        ) : (
          <div>Ładowanie opisu profilu...</div>
        )}
      </div>
      <UserPostsFetcher/>
    </div>
  );
}


export default PokazProfil;
