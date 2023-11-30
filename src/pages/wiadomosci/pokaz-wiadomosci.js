import React, { useState, useEffect } from 'react';
import './pokaz-wiadomosci.css';
import MessageIcon from '@mui/icons-material/Message';
import {
  auth,
  db,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
} from '../../firebase';

function PokazWiadomosci() {
  const [wiadomosc, setWiadomosc] = useState('');
  const [uzytkownicy, setUzytkownicy] = useState([]);
  const [odbiorcaId, setOdbiorcaId] = useState('');
  const [wiadomosci, setWiadomosci] = useState([]);

  useEffect(() => {
    const fetchDane = async () => {
      try {
        const usersCollection = collection(db, 'user');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => {
          const docID = doc.id;
          const docData = doc.data();
          return { uid: docID, ...docData };
        });

        console.log('Users:', usersList);
        setUzytkownicy(usersList);

        const currentUser = auth.currentUser;

        if (currentUser && odbiorcaId) {
          const messagesCollection = collection(db, 'messages');
          const q = query(
            messagesCollection,
            orderBy('timestamp', 'asc'),
            where('senderId', 'in', [currentUser.uid, odbiorcaId]),
            where('receiverId', 'in', [currentUser.uid, odbiorcaId])
          );

          const querySnapshot = await getDocs(q);
          const receivedMessages = querySnapshot.docs.map((doc) => doc.data());

          console.log('Received messages:', receivedMessages);

          setWiadomosci(receivedMessages);
        }
      } catch (error) {
        console.error('Błąd pobierania danych:', error);
      }
    };

    fetchDane();
  }, [odbiorcaId]);

  const getUserByUserUID = (userUID) => {
    return uzytkownicy.find((user) => user.UserUID === userUID) || null;
  };

  const formatTimestamp = (timestamp) => {
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  const wyslijWiadomosc = async () => {
    const currentUser = auth.currentUser;

    if (currentUser && odbiorcaId && wiadomosc.trim() !== '') {
      try {
        const receiver = getUserByUserUID(odbiorcaId);

        const messagesCollection = collection(db, 'messages');
        await addDoc(messagesCollection, {
          senderId: currentUser.uid,
          receiverId: receiver.UserUID,
          senderName: currentUser.displayName || 'Nieznany użytkownik',
          receiverName: receiver ? receiver.UserName : 'Nieznany użytkownik',
          content: wiadomosc,
          timestamp: new Date(),
        });

        setWiadomosci((prevWiadomosci) => [
          ...prevWiadomosci,
          {
            senderId: currentUser.uid,
            receiverId: receiver.UserUID,
            senderName: currentUser.displayName || 'Nieznany użytkownik',
            receiverName: receiver ? receiver.UserName : 'Nieznany użytkownik',
            content: wiadomosc,
            timestamp: new Date(),
          },
        ]);

        console.log('Wiadomość wysłana pomyślnie!');
        setWiadomosc('');
      } catch (error) {
        console.error('Błąd wysyłania wiadomości:', error);
      }
    } else {
      console.error(
        'Użytkownik nie jest zalogowany, nie wybrano odbiorcy lub wiadomość jest pusta.'
      );
    }
  };

  return (
    <div className="inboxView">
      <div className="titleInbox">
        <h2>Witaj w Twojej skrzynce odbiorczej!</h2>
      </div>
      <div className="shortInfoInbox">
        <h3>
          Możesz tutaj wysyłać wiadomości prywatne do innych użytkowników.
          <br></br> Spróbuj wysłać swoją pierwszą wiadomość!
        </h3>
      </div>
      <div className="buttonSendMsg">
        <h3>Rozpocznij konwersację, wybierając z listy użytkownika:</h3><br></br>
        <select
          value={odbiorcaId}
          onChange={(e) => setOdbiorcaId(e.target.value)}
          className="msgReceiver"
        >
          <option key="" value="">
            Wybierz użytkownika
          </option>
          {uzytkownicy
            .filter((user) => user.UserUID !== auth.currentUser.uid)
            .map((user) => (
              <option key={user.uid} value={user.UserUID}>
                {user.UserName}
              </option>
            ))}
        </select>
        <br></br>
        {odbiorcaId && (
          <div className="msgInputSection">
            <input
              type="text"
              placeholder="Wpisz wiadomość..."
              value={wiadomosc}
              onChange={(e) => setWiadomosc(e.target.value)}
              className="msgTextArea"
            />
            <button className="sendMsg" onClick={wyslijWiadomosc}>
              <h2>
                <MessageIcon className="msgIcon" />
                Wyślij wiadomość
              </h2>
            </button>
          </div>
        )}
      </div>
      {odbiorcaId && (
        <div className="receivedMessages">
          {wiadomosci.length === 0 ? (
            <p className="noMessages">Brak wiadomości z wybranym użytkownikiem, napisz jako pierwszy!</p>
          ) : (
            wiadomosci.map((message, index) => {
              const sender = getUserByUserUID(message.senderId);
              const senderName = sender ? sender.UserName : 'Nieznany użytkownik';

              return (
                <div
                  key={index}
                  className={
                    message.senderId === auth.currentUser.uid
                      ? 'sentMessage'
                      : 'receivedMessage'
                  }
                >
                  <div className="messageContent">
                    <p className="messageText">
                      <strong>{formatTimestamp(message.timestamp)}</strong>{' '}
                      {senderName}: {message.content}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default PokazWiadomosci;
