// połączenie z bazą danych na Firebase
import { initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { where, doc, deleteDoc, updateDoc, getFirestore, collection, getDocs, addDoc, query, orderBy, limit} from 'firebase/firestore/lite';
import { Collections } from "@mui/icons-material";

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

async function addNewPost(collectionName, postData) {
  const postsCol = collection(db, collectionName);
  try {
    const newPostRef = await addDoc(postsCol, postData);
    return true;
  } catch (error) {
    return false;
  }
}

async function updatePost(collectionName, documentId, newData)
{
  const documentRef = doc(db, collectionName, documentId);
  try {
    await updateDoc(documentRef, newData);
    return true;
  } catch (error) {
    return false;
  }
}

async function deletePost(collectionName, documentId)
{
  const deleteDocument  = doc(db, collectionName, documentId);
  try {
    await deleteDoc(deleteDocument);
    return true;
  } catch (error) {
    return false;
  }
}

async function addCom(collName, comData) {
  const postsCol = collection(db, collName);
  const newPostRef = await addDoc(postsCol, comData);
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
export default app;