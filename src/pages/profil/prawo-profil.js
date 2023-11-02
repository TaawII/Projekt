import React, { useContext } from 'react';
import './prawo-profil.css'
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import Zakladka from '../home/panel-boczny-zakladki';
import { auth } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';

function PrawoProfil() {
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
          <Zakladka Ikonka={LogoutIcon} tekst="Wyloguj" onClick={handleLogout} />
    </div>
  );
}

export default PrawoProfil;
