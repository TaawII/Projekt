// połączenie z bazą danych na Firebase
import { initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, collection, getDocs, addDoc, query, orderBy, limit} from 'firebase/firestore/lite';
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
  const List = Snapshot.docs.map(doc => doc.data());
  console.log(List);
  return List;
}

async function addNewPost(collectionName, postData) {
  const postsCol = collection(db, collectionName);
  const newPostRef = await addDoc(postsCol, postData);
  console.log('Nowy dokument został dodany z ID:', newPostRef.id);
}

export { getPost, addNewPost };
//4W
export const auth = getAuth(app);
export const storage = getStorage();
export default app;