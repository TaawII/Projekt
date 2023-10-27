import React, { useContext } from 'react';
import './prawo.css'
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import Zakladka from './panel-boczny-zakladki';
import { auth } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import { Search } from '@mui/icons-material';
import { SearchUser } from './searchUser';

function Prawo() {
  const navigate = useNavigate();
  const { currentUser, dispatch } = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" }); 
      navigate('/login');
      console.log("Wylogowano pomyślnie");
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  return (
    <div className="prawo">
        <>
          <p>Jesteś zalogowany jako: {currentUser.displayName}</p>
          <Zakladka Ikonka={LogoutIcon} tekst="Wyloguj" onClick={handleLogout} />

          <SearchUser />
        </>
    </div>
  );
}

export default Prawo;
