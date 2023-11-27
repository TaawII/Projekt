import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, getDocs, addDoc, query, orderBy, where, limit, getDoc, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore/lite'; 

export {
  db,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  where,
  limit,
};

const firebaseConfig = {
  apiKey: "AIzaSyCcGyQDGL55AL5U3gGYsBk8sp5bfwBj970",
  authDomain: "projekt-zespolowy-baza.firebaseapp.com",
  projectId: "projekt-zespolowy-baza",
  storageBucket: "projekt-zespolowy-baza.appspot.com",
  messagingSenderId: "748726290430",
  appId: "1:748726290430:web:abb2273c1602bb4d6062af"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

// userUID - IdProfilu, userID - nasze id
async function removeFollow(userUID, userID) {
  try {
    const q = query(collection(db, 'user'), where("UserUID", "==", userUID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documentSnapshot = querySnapshot.docs[0];

      if (documentSnapshot.exists()) {
        const currentFollow = documentSnapshot.data().Follow || {};

        if (currentFollow[userID]) {
          // Jeżeli follow już istnieje, usuwamy go
          delete currentFollow[userID];

          const reactionRef = doc(db, 'user', documentSnapshot.id);
          await updateDoc(reactionRef, { Follow: currentFollow });
          return true;
        }
      }
    } else {
      console.log('Nie znaleziono dokumentu o podanym UserUID.');
      return false;
    }
  } catch (error) {
    console.error('Błąd podczas usuwania follow:', error);
    return false;
  }
}

async function checkBlocked(userUID,userID) {
  try {
    const q = query(collection(db, 'user'), where("UserUID", "==", userUID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documentSnapshot = querySnapshot.docs[0];

      if (documentSnapshot.exists()) {
        let blockedArray = documentSnapshot.data().Blocked || {};
        if (blockedArray[userID]) {
          console.log("Jestes zablokowany!");
          return true;
        } else {
          console.log("Nie jestes zablokowany!");
          return false;
        }
      }
    } else {
      console.log('Nie znaleziono dokumentu o podanym UserUID.');
      return false;
    }
  } catch (error) {
    console.error('Błąd podczas pobierania obiektu "Blocked":', error);
    return false;
  }
  return false;
}

async function changeBlocked(userUID, userID) {
  try {
    const q = query(collection(db, 'user'), where("UserUID", "==", userID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documentSnapshot = querySnapshot.docs[0];

      if (documentSnapshot.exists()) {
        const currentBan = documentSnapshot.data().Blocked || {};

        if (currentBan[userUID]) {
          // Jeżeli Blokada już istnieje, usuwamy go
          delete currentBan[userUID];

          const reactionRef = doc(db, 'user', documentSnapshot.id);
          await updateDoc(reactionRef, { Blocked: currentBan });
          return true;
        } else {
          // Jeżeli Blokada nie istnieje, dodajemy go
          currentBan[userUID] = 'Blocked';

          const reactionRef = doc(db, 'user', documentSnapshot.id);
          await updateDoc(reactionRef, { Blocked: currentBan });
          // oraz zdejmujemy mu followa
          await removeFollow(userUID,userID);
          return true;
        }
      }
    } else {
      console.log('Nie znaleziono dokumentu o podanym UserUID.');
      return false;
    }
  } catch (error) {
    console.error('Błąd podczas dodawania/usuwania blokady:', error);
    return false;
  }
}

async function checkFollow(userUID, userID) {
  try {
    const q = query(collection(db, 'user'), where("UserUID", "==", userUID));
    const querySnapshot = await getDocs(q);
    const documentSnapshot = querySnapshot.docs[0];

    if (documentSnapshot.exists()) {
      const currentFollow = documentSnapshot.data().Follow || {};

     if (currentFollow[userID]) {
        return true;
      }
    }
  } catch (error) {
    console.error('Błąd podczas sprawdzania Follow:', error);
    return false;
  }
  return false;
}

async function getPostFollow(collectionName, userUid) {
  try {
    // Pobierz tablicę Follow
    const followArray = await getFollowArray(userUid);

    // Przygotuj zapytanie do kolekcji
    const Collection = collection(db, collectionName);
    const q = query(Collection, where("UID", "in", Object.keys(followArray)), orderBy("Timestamp", "desc"), limit(5));

    // Pobierz Snapshot
    const Snapshot = await getDocs(q);

    // Przetwórz dane
    const List = Snapshot.docs.map((doc) => {
      const docID = doc.id;
      const docData = doc.data();
      return { id: docID, ...docData };
    });

    console.log(List);
    return List;
  } catch (error) {
    console.error('Błąd podczas pobierania wpisów:', error);
    return [];
  }
}

async function getFollowArray(userUID) {
  try {
    const q = query(collection(db, 'user'), where("UserUID", "==", userUID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documentSnapshot = querySnapshot.docs[0];

      if (documentSnapshot.exists()) {
        let followArray = documentSnapshot.data().Follow || {};

        followArray[userUID] = 'Follow';

        console.log('Obiekt "Follow":', followArray);

        return followArray;
      }
    } else {
      console.log('Nie znaleziono dokumentu o podanym UserUID.');
      return { [userUID]: 'Follow' };
    }
  } catch (error) {
    console.error('Błąd podczas pobierania obiektu "Follow":', error);
    return { [userUID]: 'Follow' };
  }
}

async function getUserUid(userName) {
  const Colection = collection(db, 'user');
  const q = query(Colection,where("UserName", "==", userName), limit(1));
  const Snapshot = await getDocs(q);
  
  const List = Snapshot.docs.map((doc) => {
    const docID = doc.id;
    const docData = doc.data();
    return { id: docID, ...docData };
  });

  console.log(List);
  return List;
}

async function addFollow(userUID, userID) {
  try {
    const q = query(collection(db, 'user'), where("UserUID", "==", userUID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documentSnapshot = querySnapshot.docs[0];

      if (documentSnapshot.exists()) {
        const currentFollow = documentSnapshot.data().Follow || {};

        if (currentFollow[userID]) {
          // Jeżeli follow już istnieje, usuwamy go
          delete currentFollow[userID];

          const reactionRef = doc(db, 'user', documentSnapshot.id);
          await updateDoc(reactionRef, { Follow: currentFollow });
          return true;
        } else {
          // Jeżeli follow nie istnieje, dodajemy go
          currentFollow[userID] = 'Follow';

          const reactionRef = doc(db, 'user', documentSnapshot.id);
          await updateDoc(reactionRef, { Follow: currentFollow });
          return true;
        }
      }
    } else {
      console.log('Nie znaleziono dokumentu o podanym UserUID.');
      return false;
    }
  } catch (error) {
    console.error('Błąd podczas dodawania/usuwania follow:', error);
    return false;
  }
}

async function getUserName(userUID) {
  const Colection = collection(db, 'user');
  const q = query(Colection,where("UserUID", "==", userUID), limit(1));
  const Snapshot = await getDocs(q);
  
  const List = Snapshot.docs.map((doc) => {
    const docID = doc.id;
    const docData = doc.data();
    return { id: docID, ...docData };
  });

  console.log(List);
  return List;
}

function addNewUser(postData) {
  const postsCol = collection(db, 'user');
  try {
    addDoc(postsCol, postData);
    return true;
  } catch (error) {
    return false;
  }
}

async function getPost(collectionName) {
  const Colection = collection(db, collectionName);
  const q = query(Colection, orderBy("Timestamp", "desc"), limit(5));
  const Snapshot = await getDocs(q);
  
  const List = Snapshot.docs.map((doc) => {
    const docID = doc.id;
    const docData = doc.data();
    return { id: docID, ...docData };
  });

  console.log(List);
  return List;
}

function addNewPost(collectionName, postData) {
  const postsCol = collection(db, collectionName);

  if (!postData.Tresc || postData.Tresc.trim() === '') {
    return false;
  }

  try {
    const newPostRef = addDoc(postsCol, postData);
    window.location.reload();
    return true;
  } catch (error) {
    return false;
  }
}

function updatePost(collectionName, documentId, newContent) {
  const documentRef = doc(db, collectionName, documentId);
  try {
    updateDoc(documentRef, newContent);
    return true;
  } catch (error) {
    return false;
  }
}

function deletePost(collectionName, documentId)
{
  const deleteDocument  = doc(db, collectionName, documentId);
  try {
    deleteDoc(deleteDocument);
    return true;
  } catch (error) {
    return false;
  }
}

async function addCom(collName, comData) {
  const postsCol = collection(db, collName);
  try {
    const newPostRef = await addDoc(postsCol, comData);
    console.log('Nowy dokument do bazy: ' + collName + ' został dodany z ID:', newPostRef.id);
  } catch (error) {
    console.error('Błąd podczas dodawania dokumentu:', error);
  }
}

async function GetCom(collectionName, idWpisu) {
  const Colection = collection(db, collectionName);
  const q = query(Colection, where("PostId", "==", idWpisu),limit(5));
  const Snapshot = await getDocs(q);
  
  const List = Snapshot.docs.map((doc) => {
    const docID = doc.id;
    const docData = doc.data();
    return { id: docID, ...docData };
  });

  console.log(List);
  return List;
}

//Dodawanie avatara do profilu
async function uploadAvatar(file, currentUser) {
  const fileRef = ref(storage, currentUser.uid + '.png');

  try {
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    return photoURL; // Zwracaj photoURL
  } catch (error) {
    console.error('Błąd podczas przesyłania avatara:', error);
    throw error; // Rzuć błąd w przypadku problemu
  }
}

export const getAvatarFromStorage = async (user) => {
  try {
    const avatarPath = `${user.uid}.png`;
    const avatarRef = storage.ref(avatarPath);
    const avatarURL = await avatarRef.getDownloadURL();

    return avatarURL;
  } catch (error) {
    throw error;
  }
};

// dodawanie reakcji do wpisow
async function addReaction(collectionName, itemID, userID, reactionType) {
  const reactionRef = doc(db, collectionName, itemID);

  try {
    const documentSnapshot = await getDoc(reactionRef);

    if (documentSnapshot.exists()) {
      const currentReactions = documentSnapshot.data().Reactions || {};

      if (!currentReactions[userID]) {
        currentReactions[userID] = reactionType;
        await updateDoc(reactionRef, { Reactions: currentReactions });
      }
    }
  } catch (error) {
    console.error('Błąd podczas dodawania reakcji:', error);
  }
}

async function getReactionsFromDatabase(postId, userId) {
  const reactionRef = doc(db, 'wpisy', postId); 

  try {
    const documentSnapshot = await getDoc(reactionRef);

    if (documentSnapshot.exists()) {
      const data = documentSnapshot.data();

      if (data.Reactions) {
        const likeCount = Object.values(data.Reactions).filter((reaction) => reaction === 'lubie').length;
        return { like: likeCount };
      }
    }

    return { like: 0 }; 
  } catch (error) {
    console.error('Błąd podczas pobierania reakcji:', error);
    return { like: 0 }; 
  }
}

// to nie dziala jeszcze
async function removeReaction(collectionName, itemID, userID, reactionType) {
  const reactionRef = doc(db, collectionName, itemID);

  try {
    const documentSnapshot = await getDoc(reactionRef);

    if (documentSnapshot.exists()) {
      const currentReactions = documentSnapshot.data().Reactions || {};

      if (currentReactions[userID] === reactionType) {
        delete currentReactions[userID];

        await updateDoc(reactionRef, { Reactions: currentReactions });
      }
    }
  } catch (error) {
    console.error('Błąd podczas usuwania reakcji:', error);
  }
}

function formatTime(date) {
  if (date instanceof Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes}`;
  } else {
    return 'Błąd formatowania czasu';
  }
}

async function uploadBackground(file, currentUser) {
  const fileRef = ref(storage, currentUser.uid + '_background.jpg');

  try {
    await uploadBytes(fileRef, file);
    const backgroundURL = await getDownloadURL(fileRef);
    return backgroundURL; // Zwracaj backgroundURL
  } catch (error) {
    console.error('Błąd podczas przesyłania tła:', error);
    throw error; // Rzuć błąd w przypadku problemu
  }
}

export const getProfileDescription = async (uid) => {
  const userDocRef = doc(db, 'description', uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return userDocSnap.data().description;
  } else {
    return '';
  }
};

export const updateProfileDescription = async (uid, description) => {
  const userDocRef = doc(db, 'description', uid);
  await setDoc(userDocRef, { description });
};

export const addRetweet = async (collectionName, data) => {
  const retweetsCollection = collection(db, collectionName); 

  try {
    await addDoc(retweetsCollection, data); 
    console.log('Dodano retweet do bazy danych.');
  } catch (error) {
    console.error('Błąd podczas dodawania retweetu:', error);
    throw error;
  }
};

export const removeRetweet = async (collectionName, postId, userId) => {
  const retweetsCollection = collection(db, collectionName);

  try {
    const q = query(retweetsCollection, where('PostId', '==', postId), where('UserID', '==', userId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const retweetId = snapshot.docs[0].id;
      await deleteDoc(doc(retweetsCollection, retweetId));
      console.log('Usunięto retweet z bazy danych.');
    } else {
      console.log('Brak retweetu do usunięcia.');
    }
  } catch (error) {
    console.error('Błąd podczas usuwania retweetu:', error);
    throw error;
  }
};

export const auth = getAuth(app);
export const storage = getStorage();


export {checkBlocked, changeBlocked, checkFollow, getPostFollow, addFollow, getUserUid, addNewUser, getPost, addNewPost, addCom, updatePost, deletePost, getReactionsFromDatabase, removeReaction, addReaction, formatTime, GetCom, uploadAvatar, uploadBackground, getUserName };


export default app;