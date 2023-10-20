import React, { useEffect, useState } from 'react';
import './post.css';
import { getPost} from '../../firebase';

//Pobieranie z bazy wszystkich postów
function Post() {
    const [postList, setPostList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                const posts = await getPost("wpisy");
                setPostList(posts);
            } catch (error) {
                setError(error);
            }
        }

        fetchPost();
    }, []);

    return (
        <div className="post">
            {
                postList.map((post, index) => (
                    <div key={index}>
                        <div className='userPost'>
                        {post.Imie + " (" + post.Pseudonim +")"}
                        </div>
                        <div className='textPost'>
                        {post.Tresc}
                        </div>
                        <div className='comPost'>
                            <button>Koment</button>
                        </div>
                    </div>
                ))
            }
            {error && <div>Error: {error.message}</div>}
        </div>
    );
}

export default Post;