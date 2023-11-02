// połączenie z bazą danych na Firebase
import React, { useState } from 'react';
import { getUserUid } from '../../firebase';
import { Link, RouterProvider, useNavigate } from 'react-router-dom';

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
        <>
        <form onSubmit={handleUserNameSubmit} autoComplete="off">
                <input
                    type="text"
                    value={userName}
                    onChange={handleUserNameChange}
                    placeholder="Wyszukaj użytkownika..."
                />
                <button>Szukaj</button>
        </form>
        </>
    )
}
 
export default SearchUser
