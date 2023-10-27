// połączenie z bazą danych na Firebase
import React, { useState } from 'react';
import '../../firebase'

function SearchUser()
    {
    const [userName, setUserName] = useState('');
    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    };

    const handleUserNameSubmit = () => {
        console.log(userName)
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

export {SearchUser}