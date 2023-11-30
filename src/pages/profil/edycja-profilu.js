import React, { useContext, useState, useEffect, useRef } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import {  changeBlocked, uploadAvatar, uploadBackground, getProfileDescription, updateProfileDescription } from '../../firebase';
import './edycja-profilu.css';
import { AuthContext } from '../../context/AuthContext';
import Image from './img/avatar_default.jpg';
import DefaultBackgroundImage from './img/bg_user_default.jpg';
import UserPostsFetcher from './posts';
import {  db, collection, getDocs } from '../../firebase';

function EdycjaProfilu() {
  const { currentUser } = useContext(AuthContext);
  const [photo, setPhoto] = useState(null);
  const [userPhotoURL, setUserPhotoURL] = useState(currentUser.photoURL || Image);
  const [backgroundImage, setBackgroundImage] = useState(DefaultBackgroundImage);
  const [description, setDescription] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [uzytkownicy, setUzytkownicy] = useState([]);
  const [odbiorcaId, setOdbiorcaId] = useState('');
  
  const fileInputRef = useRef(null);
  const avatarRef = useRef(null);
  const storage = getStorage();
  const avatarStorageRef = ref(storage, currentUser.uid + '.png');
  const backgroundStorageRef = ref(
    storage,
    currentUser.uid + '_background.jpg'
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'user');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => {
          const docID = doc.id;
          const docData = doc.data();
          return { uid: docID, ...docData };
        });
        setUzytkownicy(usersList);
        console.log(usersList);
      } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
      }
    };

    fetchUsers();
  }, []);

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
        setTempDescription(userDescription);
        setIsUserDataLoaded(true);
      });
  }, [currentUser]);

  useEffect(() => {
    if (photo) {
      handleAvatarChange();
    }
  }, [photo]);

  const changeBan = async () => {
    console.log(odbiorcaId);
    await changeBlocked(odbiorcaId, currentUser.uid);
  }

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
              title="Kliknij, aby zmienić tło"
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

        {isEditingDescription ?  (
  <div className='editText'>
    <textarea
      className="editTextarea"  
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Dodaj opis..."
    />
    <button className="descButton" onClick={handleSaveDescription}><h2>Zapisz</h2></button>
    <button className="descButton" onClick={handleCancelDescription}><h2>Anuluj</h2></button>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
  <select
    value={odbiorcaId}
    onChange={(e) => setOdbiorcaId(e.target.value)}
    style={{ marginBottom: '10px' }}
  >
    <option key="" value="">
      Wybierz użytkownika
    </option>
    {uzytkownicy.map((user) => (
      <option key={user.UserUID} value={user.UserUID}>
        {user.UserName}
      </option>
    ))}
  </select>
  <button className="sendMsg" onClick={changeBan}>
    <h2>Blokowanie/Odblokowanie</h2>
  </button>
</div>
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