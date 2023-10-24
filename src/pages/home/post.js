import React, { useEffect, useState, useContext, createContext } from 'react';
import './post.css';
import { getPost, addCom, updatePost, deletePost} from '../../firebase';
import { doc } from 'firebase/firestore/lite';
import { AuthContext } from '../../context/AuthContext';
import { RenderCom}  from './com.js'
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';


function DeleteButton({ postId }) {
    const DeletePost = () => {
      if (deletePost('wpisy', postId)) {
        window.location.reload();
      }
    };
  
    return (
      <div>
        <IconButton onClick={DeletePost} color="primary">
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }

function EditForm({ postId, postTresc }) {
    const [comment, setComment] = useState(postTresc);
  
    const HandleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const [isVisible, setIsVisible] = useState(false);

    const ToggleVisibility = () => {
        setComment(postTresc);
        setIsVisible(!isVisible);
      };

    const ExitPost = () => {
        ToggleVisibility();
    }
    const SavePost = () => {
        console.log('Wprowadzony komentarz dla postu', postId, ':', comment);
        const newData = {
            Tresc: comment,
        }
        if(updatePost('wpisy', postId, newData))
        {
            ToggleVisibility();
            window.location.reload();
        }
    };


    return (
        <div>
            <button onClick={ToggleVisibility}>Edytuj Wpis</button>
            {isVisible ? (
                <div className="modal">
                    <div className="modal-content">
                        <textarea value={comment} onChange={HandleCommentChange}></textarea>
                        <div className="modal-button">
                            <button onClick={SavePost} className="save">Zapisz</button>
                            <button onClick={ExitPost} className="exit">Anuluj</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

//P
function CommentForm({ postId }) {
    const [comment, setComment] = useState('');
  
    const HandleCommentChange = (event) => {
      setComment(event.target.value);
    };
  
    const SendComment = (event) => {
      event.preventDefault();
      var ComData =
      {
        PostId: postId,
        ComText: comment,
        Timestamp: new Date(),
      }
      addCom('com', ComData);
      console.log('Wprowadzony komentarz dla postu', postId, ':', comment);
    };
  
    return (
      <form onSubmit={SendComment}>
        <input type="text" value={comment} onChange={HandleCommentChange} />
        <button type="submit">Koment</button>
      </form>
    );
}
//B

function UserValidation(postData)
{
    const { currentUser } = useContext(AuthContext);
    const pData = postData.postData;
    if(pData.UID == currentUser.uid)
    {
        return(
            <div>
                <EditForm  postId={pData.id} postTresc={pData.Tresc}/>
                <DeleteButton postId={pData.id}/>
            </div>
            )
    }
    return null;
}

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
                    <div id={post.id} key={index}>
                        <div className='userPost'>
                            {post.Pseudonim}
                            <div className="postUD">
                                <UserValidation postData={post}/>
                            </div>
                        </div>
                        <div className='textPost'>
                            {post.Tresc}
                        </div>
                        <div className='comPost'>
                            <CommentForm postId={post.id} />
                            <div className='comPostRender'>
                                {
                                    <RenderCom id={post.id}/>
                                }
                            </div>
                        </div>
                    </div>
                ))
            }
            {error && <div>Error: {error.message}</div>}
        </div>
    );
}

export default Post;