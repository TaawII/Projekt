import React, { useContext, useState, useEffect, useRef } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { uploadAvatar } from '../../firebase';
import './edycja-profilu.css';
import { AuthContext } from '../../context/AuthContext';
import BackgroundImage from './img/bg_user_default.jpg';
import Image from './img/avatar_default.jpg';

function EdycjaProfilu() {
  const { currentUser } = useContext(AuthContext);
  const [photo, setPhoto] = useState(null);
  const [userPhotoURL, setUserPhotoURL] = useState(currentUser.photoURL || Image);

  const [selectedImage, setSelectedImage] = useState(BackgroundImage);
  const fileInputRef = useRef(null);

  const storage = getStorage();
  const avatarRef = ref(storage, currentUser.uid + '.png');

  useEffect(() => {
    getDownloadURL(avatarRef)
      .then((url) => {
        setUserPhotoURL(url);
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania avatara z Firebase Storage:', error);
      });
  }, [currentUser]);

  const handleAvatarChange = async () => {
    try {
      if (photo) {
        const photoURL = await uploadAvatar(photo, currentUser);
        setUserPhotoURL(photoURL);
      }
    } catch (error) {
      console.error('Błąd podczas przesyłania avatara:', error);
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const isDefaultImage = selectedImage === BackgroundImage;

  return (
    <div className="infoProfil">
      <div className="tloProfilu">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} />

        <img src={selectedImage} alt="BackgroundImage" className={`tloProfilu${isDefaultImage ? '' : ' clickable'}`}  /*style={{ cursor: 'pointer' }}*/ onClick={handleImageClick} />
          
        {
          <button onClick={() => setSelectedImage(BackgroundImage)} style={{ display: 'none' }}></button>
        }

      </div>
      <div className="info">
        <img src={userPhotoURL} alt="Avatar" className="avatar" />
        <span className="displayName">{currentUser.displayName}</span><br></br>
        <input type="file" accept="image/*" onChange={handleFileChange}></input>
        <button disabled={!photo} onClick={handleAvatarChange}>Wyślij</button>
      </div>
    </div>
  );
}

export default EdycjaProfilu;
