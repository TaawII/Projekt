import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; 
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Avatar } from "@mui/material";

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

      const userPostsCollection = collection(db, 'wpisy');
      const userPostsQuery = query(userPostsCollection, where('UID', '==', uid), orderBy('Timestamp', 'desc'));

      const retweetsCollection = collection(db, 'retweets');
      const retweetsQuery = query(retweetsCollection, where('UserID', '==', uid), orderBy('Timestamp', 'desc'));

      const storage = getStorage();

      try {
        const userPostsSnapshot = await getDocs(userPostsQuery);
        const userPosts = userPostsSnapshot.docs.map(async (doc) => {
          const post = {
            id: doc.id,
            ...doc.data(),
          };

          const avatarRef = ref(storage, `${post.UID}.png`);

          try {
            const url = await getDownloadURL(avatarRef);
            post.userPhotoURL = url;
          } catch (error) {
            console.error('Błąd podczas pobierania avatara z Firebase Storage:', error);
          }

          return post;
        });

        const retweetsSnapshot = await getDocs(retweetsQuery);
        const retweets = retweetsSnapshot.docs.map(async (retweetDoc) => {
          const retweet = {
            id: retweetDoc.id,
            ...retweetDoc.data(),
          };

          const retweetedPostRef = doc(db, 'wpisy', retweet.PostId);
          const retweetedPostDoc = await getDoc(retweetedPostRef);
          
          if (retweetedPostDoc.exists()) {
            const retweetedPost = {
              id: retweetedPostDoc.id,
              ...retweetedPostDoc.data(),
            };

            const avatarRef = ref(storage, `${retweetedPost.UID}.png`);

            try {
              const url = await getDownloadURL(avatarRef);
              retweet.userPhotoURL = url;
            } catch (error) {
              console.error('Błąd podczas pobierania avatara z Firebase Storage:', error);
            }

            return {
              ...retweet,
              ...retweetedPost,
            };
          } else {
            return null;
          }
        });

        const userPostsWithAvatars = await Promise.all(userPosts);
        const retweetsWithAvatars = (await Promise.all(retweets)).filter(Boolean); 

        const combinedPosts = [...userPostsWithAvatars, ...retweetsWithAvatars];
        const sortedPosts = combinedPosts.sort((a, b) => b.Timestamp.toDate() - a.Timestamp.toDate());

        setUserPosts(sortedPosts);
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
              <Avatar alt={post.Pseudonim} src={post.userPhotoURL} />
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
