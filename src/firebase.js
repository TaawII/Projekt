// połączenie z bazą danych na Firebase
import { initializeApp} from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { where, doc, deleteDoc, updateDoc, getFirestore, collection, getDocs, addDoc, query, orderBy, limit, getDoc } from 'firebase/firestore/lite';

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

//4W

//P
//Dodać sortowanie od najnowszego

// dodać sortowanie od najnowszego

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
export async function uploadAvatar(file, currentUser, setLoading) {
  const fileRef = ref(storage, currentUser.uid + '.png');

  setLoading(true);

  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  updateProfile(currentUser, {photoURL});

  setLoading(false);
  alert("Plik został wysłany");
} 

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

export const auth = getAuth(app);
export const storage = getStorage();

export {getUserUid, addNewUser, getPost, addNewPost, addCom, updatePost, deletePost, getReactionsFromDatabase, removeReaction, addReaction, formatTime, GetCom };

export default app;