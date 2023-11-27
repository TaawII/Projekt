import React, { useState, useEffect } from 'react';
import './pokaz-wiadomosci.css';
import MessageIcon from '@mui/icons-material/Message';
import { auth, db, collection, getDocs, addDoc } from '../../firebase';

function PokazWiadomosci() {
    const [wiadomosc, setWiadomosc] = useState('');
    const [uzytkownicy, setUzytkownicy] = useState([]);
    const [odbiorcaId, setOdbiorcaId] = useState('');
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const usersCollection = collection(db, 'user');
          const usersSnapshot = await getDocs(usersCollection);
          const usersList = usersSnapshot.docs.map(doc => {
            const docID = doc.id;
            const docData = doc.data();
            return { uid: docID, ...docData };
          });
          setUzytkownicy(usersList);
          console.log(usersList);
        } catch (error) {
          console.error('Błąd pobierania użytkowników:', error);
        }
      };
  
      fetchUsers();
    }, []);

    const wyslijWiadomosc = async () => {
        const currentUser = auth.currentUser;
    
        if (currentUser && odbiorcaId && wiadomosc.trim() !== '') {
          try {
            const usersCollection = collection(db, 'user');
            const querySnapshot = await getDocs(usersCollection);
            const receiverDoc = querySnapshot.docs.find(doc => doc.id === odbiorcaId);
    
            if (receiverDoc) {
              const receiverData = receiverDoc.data();
              const messagesCollection = collection(db, 'messages');
              await addDoc(messagesCollection, {
                senderId: currentUser.uid,
                receiverId: odbiorcaId,
                content: wiadomosc,
                timestamp: new Date(),
              });
              console.log('Wiadomość wysłana pomyślnie!');
              setWiadomosc('');
            } else {
              console.error('Nie znaleziono odbiorcy w kolekcji użytkowników.');
            }
          } catch (error) {
            console.error('Błąd wysyłania wiadomości:', error);
          }
        } else {
          console.error('Użytkownik nie jest zalogowany, nie wybrano odbiorcy lub wiadomość jest pusta.');
        }
      };

  return (
    <div className="inboxView">
        <div className="titleInbox">
            <h2>Witaj w Twojej skrzynce odbiorczej!</h2>
        </div>
        <div className="shortInfoInbox">
            <h3>Możesz tutaj wysyłać wiadomości prywatne do innych użytkownikow.<br></br> Spróbuj wysłać swoją pierwszą wiadomość!</h3>
        </div>
      <div className="buttonSendMsg">
      <select
          value={odbiorcaId}
          onChange={(e) => setOdbiorcaId(e.target.value)}
          className="msgReceiver"
        >
          <option key="" value="">Wybierz odbiorcę</option>
          {uzytkownicy.map(user => (
            <option key={user.uid} value={user.uid}>{user.UserName}</option>
          ))}
        </select><br></br>
        <input
          type="text"
          placeholder="Wpisz swoją wiadomość..."
          value={wiadomosc}
          onChange={(e) => setWiadomosc(e.target.value)}
          className="msgTextArea"
        /><br></br>
        <button className="sendMsg" onClick={wyslijWiadomosc}>
          <h2><MessageIcon className="msgIcon"/>Wyślij wiadomość</h2>
        </button>
      </div>
      <div>
    </div>
    </div>
  );
}

export default PokazWiadomosci;
