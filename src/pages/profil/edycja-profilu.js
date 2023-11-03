import React, { useContext, useState, useEffect, useRef } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { uploadAvatar, uploadBackground, getProfileDescription, updateProfileDescription } from '../../firebase';
import './edycja-profilu.css';
import { AuthContext } from '../../context/AuthContext';
import Image from './img/avatar_default.jpg';
import DefaultBackgroundImage from './img/bg_user_default.jpg';
import UserPostsFetcher from './posts';

function EdycjaProfilu() {
  const { currentUser } = useContext(AuthContext);
  const [photo, setPhoto] = useState(null);
  const [userPhotoURL, setUserPhotoURL] = useState(currentUser.photoURL || Image);
  const [backgroundImage, setBackgroundImage] = useState(DefaultBackgroundImage);
  const [description, setDescription] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  const fileInputRef = useRef(null);
  const avatarRef = useRef(null);
  const storage = getStorage();
  const avatarStorageRef = ref(storage, currentUser.uid + '.png');
  const backgroundStorageRef = ref(
    storage,
    currentUser.uid + '_background.jpg'
  );

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

    getProfileDescription(currentUser.uid)
      .then((userDescription) => {
        setDescription(userDescription);
        setTempDescription(userDescription); // Kopiowanie do tempDescription
        setIsUserDataLoaded(true);
      });
  }, [currentUser]);

  useEffect(() => {
    if (photo) {
      handleAvatarChange();
    }
  }, [photo]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleBackgroundClick = async () => {
    const backgroundInput = document.createElement('input');
    backgroundInput.type = 'file';
    backgroundInput.accept = 'image/*';
    backgroundInput.style.display = 'none';
    document.body.appendChild(backgroundInput);

    backgroundInput.addEventListener('change', async (event) => {
      const backgroundFile = event.target.files[0];
      if (backgroundFile) {
        try {
          const backgroundURL = await uploadBackground(backgroundFile, currentUser);
          setBackgroundImage(backgroundURL);
        } catch (error) {
          console.error('Błąd podczas przesyłania tła:', error);
        }
      }
      backgroundInput.remove();
    });

    backgroundInput.click();
  };

  const handleAvatarChange = async () => {
    const avatarFile = fileInputRef.current.files[0];
    if (avatarFile) {
      try {
        const avatarURL = await uploadAvatar(avatarFile, currentUser);
        setUserPhotoURL(avatarURL);
      } catch (error) {
        console.error('Błąd podczas przesyłania avatara:', error);
      }
    }
  };

  const handleDescriptionChange = () => {
    setTempDescription(description);
    setIsEditingDescription(true);
  };

  const handleSaveDescription = () => {
    updateProfileDescription(currentUser.uid, description)
      .then(() => {
        setIsEditingDescription(false);
      })
      .catch((error) => {
        console.error('Błąd podczas zapisywania opisu:', error);
      });
  };

  const handleCancelDescription = () => {
    setDescription(tempDescription);
    setIsEditingDescription(false);
  };

  return (
    <div className="infoProfil">
      <div className="tloProfilu">
        <div className="background-image-container" onClick={handleBackgroundClick}>
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
          ref={avatarRef}
          src={userPhotoURL}
          alt="Avatar"
          className="avatar clickable"
          onClick={handleAvatarClick}
        />
        <span className="displayName">{currentUser.displayName}</span>
        <br></br>
        {isEditingDescription ? (
  <div className='editText'>
    <textarea
      className="editTextarea"  
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Dodaj opis..."
    />
    <button onClick={handleSaveDescription}>Zapisz</button>
    <button onClick={handleCancelDescription}>Anuluj</button>
  </div>
) : isUserDataLoaded ? (
  <div className='description'>
    <span className="userDescription" onClick={handleDescriptionChange}>
      {description || 'Dodaj opis...'}
    </span>
  </div>
) : (
  <div className='description'>Ładowanie opisu profilu...</div>
)}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
      </div>
      <UserPostsFetcher/>
    </div>
  );
}

export default EdycjaProfilu;