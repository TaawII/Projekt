// połączenie z bazą danych na Firebase
import React, { useState } from 'react';
import { getUserUid } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

function SearchUser()
{
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    };
 
    const handleUserNameSubmit = async (event) => {
        event.preventDefault();
        var UserData = await getUserUid(userName)
        console.log(UserData[0].UserUID);
        if(UserData[0].UserUID)
        {
          navigate(`/userprofile/${UserData[0].UserUID}`);
        };
    };

    return(
    <form className="search-form" onSubmit={handleUserNameSubmit} autoComplete="off">
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          value={userName}
          onChange={handleUserNameChange}
          placeholder="Wyszukaj użytkownika..."
        />
        <button className="search-button">
          <SearchIcon /> 
        </button>
      </div>
    </form>
    )
}
 
export default SearchUser
