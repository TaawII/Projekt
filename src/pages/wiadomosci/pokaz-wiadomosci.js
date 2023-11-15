import React from 'react';
import './pokaz-wiadomosci.css';
import MessageIcon from '@mui/icons-material/Message';

function PokazWiadomosci() {
    return (
        <div className="inboxView">
            <div className="titleInbox">
                <h2>Witaj w Twojej skrzynce odbiorczej!</h2>
            </div>
            <div className="shortInfoInbox">
                <h3>Możesz tutaj wysyłać wiadomości prywatne do innych użytkownikow.<br></br> Spróbuj wysłać swoją pierwszą wiadomość!</h3>
            </div>
            <div className="buttonSendMsg">
                <button className="sendMsg"><h2><MessageIcon className="msgIcon"/>Wyślij wiadomość</h2></button>
            </div>
        </div>
    )
};

export default PokazWiadomosci;