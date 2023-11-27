import React, { useContext, useState, useEffect } from 'react';
import './prawo.css';
import { Link } from 'react-router-dom';
import SearchUser from './searchUser.js';
import { collection, getDocs, query, orderBy, limit, db } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

function Prawo() {
  const { currentUser } = useContext(AuthContext);
  const [latestUsers, setLatestUsers] = useState([]);
  const defaultAvatarPath = 'default.png'; 

  const getDefaultAvatarURL = async () => {
    const storage = getStorage();
    const defaultAvatarRef = ref(storage, defaultAvatarPath);

    try {
      const url = await getDownloadURL(defaultAvatarRef);
      return url;
    } catch (error) {
      console.error('Błąd podczas pobierania domyślnego avatara z Firebase Storage:', error);
      return ''; 
    }
  };

  const getAvatarURL = async (userID) => {
    const storage = getStorage();
    const avatarRef = ref(storage, `${userID}.png`);

    try {
      const url = await getDownloadURL(avatarRef);
      return url;
    } catch (error) {
      console.error('Błąd podczas pobierania avatara z Firebase Storage:', error);
      return await getDefaultAvatarURL() || ''; 
    }
  };

  useEffect(() => {
    const fetchLatestUsers = async () => {
      try {
        const usersRef = collection(db, 'user');
        const q = query(usersRef, orderBy('Timestamp', 'desc'), limit(5));
        const latestUsersSnapshot = await getDocs(q);

        const latestUsersData = await Promise.all(latestUsersSnapshot.docs.map(async (doc) => {
          const userID = doc.get('UserUID');
          
          if (userID !== currentUser.uid) {
            const userData = {
              id: doc.id,
              ...doc.data(),
            };
    
            userData.avatarURL = await getAvatarURL(userID);
    
            return userData;
          } else {
            return null; 
          }
        }));

        setLatestUsers(latestUsersData.filter(user => user !== null));
      } catch (error) {
        console.error('Błąd podczas pobierania najnowszych użytkowników:', error);
      }
    };

    fetchLatestUsers();
  }, [currentUser]);

  return (
    <div className="prawo">
      <SearchUser />
      <div className="suggestedUsers">
        <h3>Sugerowani użytkownicy:</h3>
        <ul className="userList">
          {latestUsers.map((user) => (
            <li key={user.id} className="userListItem">
              <Link to={`/userprofile/${user.UserUID}`} className="userLink">
              <div className="userContainer">
                <img src={user.avatarURL} alt="Avatar" className="userAvatar" />
                <p className="userName">{user.UserName}</p>
              </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Prawo;
