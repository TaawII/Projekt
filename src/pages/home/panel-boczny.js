import React from 'react';
import './panel-boczny.css';
import Zakladka from './panel-boczny-zakladki';
import HomeIcon from '@mui/icons-material/Home';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import { Link, RouterProvider, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth'; 


function Panel() {
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

  const messagePage = () => {
    navigate('/wiadomosci');
  }

  const profilePage = () => {
    navigate(`/profil/${currentUser.uid}`);
  }

    return (
      <div className="panel">
        <Link to="/">
          <Zakladka Ikonka={HomeIcon} tekst="Główna" />
        </Link>
  
          <Zakladka Ikonka={MailOutlineIcon} tekst="Wiadomości" onClick={messagePage}/>

          <Zakladka Ikonka={PersonIcon} tekst="Profil" onClick={profilePage}/>

        <Zakladka Ikonka={LogoutIcon} tekst="Wyloguj" onClick={handleLogout} />
      </div>
    );
}

export default Panel;
