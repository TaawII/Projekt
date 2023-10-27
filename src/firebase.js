// połączenie z bazą danych na Firebase
import { initializeApp} from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { where, doc, deleteDoc, updateDoc, getFirestore, collection, getDocs, addDoc, query, orderBy, limit} from 'firebase/firestore/lite';

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
//74
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
  try {
    const newPostRef = addDoc(postsCol, postData);
    return true;
  } catch (error) {
    return false;
  }
}

function updatePost(collectionName, documentId, newData)
{
  const documentRef = doc(db, collectionName, documentId);
  try {
    updateDoc(documentRef, newData);
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

function addCom(collName, comData) {
  const postsCol = collection(db, collName);
  const newPostRef = addDoc(postsCol, comData);
  console.log('Nowy dokument do bazy: '+ collName +' został dodany z ID:', newPostRef.id);
}

export { getPost, addNewPost, addCom, updatePost, deletePost};
//4W

//P
//Dodać sortowanie od najnowszego
async function GetCom(collectionName, idWpisu) {
  const Colection = collection(db, collectionName);
  const q = query(Colection, where("PostId", "==", idWpisu),limit(2));
  const Snapshot = await getDocs(q);
  
  const List = Snapshot.docs.map((doc) => {
    const docID = doc.id;
    const docData = doc.data();
    return { id: docID, ...docData };
  });

  console.log(List);
  return List;
}
export {GetCom}
//B

export const auth = getAuth(app);
export const storage = getStorage();

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

export default app;