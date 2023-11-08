import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; 
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Avatar } from "@mui/material"

function UserPostsFetcher() {
  const [userPosts, setUserPosts] = useState([]);
  const [uid, setUid] = useState('');
  const [userPhotoURL, setUserPhotoURL] = useState(''); 

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedUid = parts[parts.length - 1];
    setUid(extractedUid);

    const fetchUserPosts = async () => {
      const db = getFirestore();
      const postsCollection = collection(db, 'wpisy');
      const q = query(postsCollection, where('UID', '==', uid), orderBy('Timestamp', 'desc'));

      try {
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        for (const post of posts) {
          const storage = getStorage();
          const avatarRef = ref(storage, `${post.UID}.png`);

          getDownloadURL(avatarRef)
            .then((url) => {
              setUserPhotoURL(url);
            })
            .catch((error) => {
              console.error('Błąd podczas pobierania avatara z Firebase Storage:', error);
            });
        }

        setUserPosts(posts);
      } catch (error) {
        console.error('Błąd podczas pobierania postów:', error);
      }
    };

    fetchUserPosts();
  }, [uid]);

  return (
    <div className="userPosts">
      <h2>Ostatnia aktywność:</h2>
      <ul>
        {userPosts.map((post) => (
          <li key={post.id} className="post">
            <div className="userPost">
              <Avatar alt={post.Pseudonim} src={userPhotoURL} />
              <div>
                <strong>{post.Pseudonim}</strong>
                <div className="postTime">
                  {post.Timestamp
                    ? `${formatDistanceToNow(post.Timestamp.toDate(), {
                        addSuffix: true,
                        locale: pl,
                      })}`
                    : 'Brak daty dodania'}
                </div>
              </div>
            </div>
            <div className="postContent">{post.Tresc}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPostsFetcher;
