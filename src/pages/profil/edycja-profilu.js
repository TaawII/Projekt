import React, { useContext, useState, useEffect, useRef } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { uploadAvatar, uploadBackground, getProfileDescription, updateProfileDescription } from '../../firebase';
import './edycja-profilu.css';
import { AuthContext } from '../../context/AuthContext';
import Image from './img/avatar_default.jpg';
import DefaultBackgroundImage from './img/bg_user_default.jpg';

function EdycjaProfilu() {
  const { currentUser } = useContext(AuthContext);
  const [photo, setPhoto] = useState(null);
  const [userPhotoURL, setUserPhotoURL] = useState(currentUser.photoURL || Image);
  const [backgroundImage, setBackgroundImage] = useState(DefaultBackgroundImage);
  const [description, setDescription] = useState(''); // Dodaj stan opisu użytkownika
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
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleSaveDescription}>Zapisz</button>
          </div>
        ) : isUserDataLoaded ? (
          <div>
            <span className="userDescription" onClick={handleDescriptionChange}>
              {description || 'Dodaj opis...'}
            </span>
          </div>
        ) : (
          <div>Ładowanie opisu profilu...</div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
      </div>
    </div>
  );
}

export default EdycjaProfilu;
