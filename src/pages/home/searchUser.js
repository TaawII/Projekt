// połączenie z bazą danych na Firebase
import React, { useState } from 'react';
import { getUserUid } from '../../firebase';
import { Link, RouterProvider, useNavigate } from 'react-router-dom';
import './prawo.css';
import SearchIcon from '@mui/icons-material/Search';

function SearchUser()
{
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userNotFound, setUserNotFound] = useState(false);
    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    };
 
    const handleUserNameSubmit = async (event) => {
        event.preventDefault();
        setUserNotFound(false);

        try {
        var UserData = await getUserUid(userName);

        console.log(UserData[0].UserUID);
        if (UserData && UserData.length > 0 && UserData[0].UserUID) {
          navigate(`/userprofile/${UserData[0].UserUID}`);
          setUserNotFound(false); 
        } else {
          setUserNotFound(true);
        }
      }
      catch (error) {
        console.error("Błąd przy pobieraniu danych użytkownika:", error);
        setUserNotFound(true);
      }
    };

    return(
    <form className="search-form" onSubmit={handleUserNameSubmit} autoComplete="off">
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          value={userName}
          onChange={(event) => {
            setUserName(event.target.value);
            setUserNotFound(false); 
          }}
          placeholder="Wyszukaj użytkownika..."
        />
        <button className="search-button">
          <SearchIcon /> 
        </button>
      </div>
      {userNotFound && <div className="error">Nie znaleziono użytkownika</div>}
    </form>
    )
}
 
export default SearchUser