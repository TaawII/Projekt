import React, { useContext } from 'react';
import './prawo-profil.css'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import SearchUser from '../home/searchUser.js';
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
            <SearchUser />
    </div>
  );
}

export default PrawoProfil;
