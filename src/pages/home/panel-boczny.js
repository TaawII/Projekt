import React from 'react';
import './panel-boczny.css';
import Zakladka from './panel-boczny-zakladki';
import HomeIcon from '@mui/icons-material/Home';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Panel() {
  return (
    <div className="panel">
      { /* tu jakieś logo można wstawić */ }
      
      { /* zakladka w panelu 1 */ }
      <Link to="/"> {/* Ścieżka do głównej strony */}
        <Zakladka Ikonka={HomeIcon} tekst="Główna" />
      </Link>

      { /* zakladka w panelu 2 */ }
      <Link to="/wiadomosci"> {/* Ścieżka do strony z wiadomościami */}
        <Zakladka Ikonka={MailOutlineIcon} tekst="Wiadomości" />
      </Link>

      { /* zakladka w panelu 3 */ }
      <Link to="/profil"> {/* Ścieżka do strony profilu */}
        <Zakladka Ikonka={PersonIcon} tekst="Profil" />
      </Link>

      { /* Przycisk - dodaj wpis */ }
      <Button variant="outlined" className="przyciskWpis" fullWidth>Testowy przycisk</Button>
    </div>
  );
}

export default Panel;
