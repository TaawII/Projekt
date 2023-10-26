import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React, { useEffect, useState, useContext } from 'react';
import './post.css';
import { getPost, addCom, updatePost, deletePost } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import { RenderCom } from './com.js';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function Post({ post }) {
  const { currentUser } = useContext(AuthContext);
  const [comment, setComment] = useState(post.Tresc);
  const [isEditing, setIsEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleSaveClick = () => {
    const newData = {
      Tresc: comment,
    };
    updatePost('wpisy', post.id, newData)
      setIsEditing(false);
  };

  const handleDeleteClick = () => {
    deletePost('wpisy', post.id)
      window.location.reload();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const ComData = {
      PostId: post.id,
      ComText: newComment,
      Timestamp: new Date(),
    };
    addCom('com', ComData)
      setNewComment('');
  };

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div id={post.id} className="post">
      <div className="userPost">
        <strong>{post.Pseudonim}</strong>
        {currentUser.uid === post.UID && (
          <div className="userActions">
            <IconButton onClick={handleMenuClick} color="primary">
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {isEditing ? (
                <MenuItem onClick={handleSaveClick}>
                  <EditIcon />
                  Zapisz
                </MenuItem>
              ) : (
                <MenuItem onClick={handleEditClick}>
                  <EditIcon />
                  Edytuj wpis
                </MenuItem>
              )}
              <MenuItem onClick={handleDeleteClick}>
                <DeleteIcon />
                Usuń wpis
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
      <div className="textPost">
        {isEditing ? (
          <textarea value={comment} onChange={handleCommentChange} />
        ) : (
          post.Tresc
        )}
      </div>
      <div className="comPost">
        {isEditing ? (
          <button onClick={handleSaveClick} className="save">
            Zapisz
          </button>
        ) : null}
        <ArrowDropDownIcon className="centerIcon" fontSize="small" onClick={handleShowComments} style={{ cursor: 'pointer' }} />
        {showComments && (
          <div className="comPostRender">
            <RenderCom id={post.id} />
          </div>
        )}
      </div>
      {showComments && (
        <div className="newComment">
  <form onSubmit={handleCommentSubmit}>
    <div className="comment-input-container">
      <input
        type="text"
        value={newComment}
        onChange={handleNewCommentChange}
        placeholder="Dodaj komentarz..."
      />
      <SendIcon onClick={handleCommentSubmit} style={{ cursor: 'pointer' }} />
    </div>
  </form>
</div>
)}

    </div>
  );
}

function PostList() {
    const [postList, setPostList] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      async function fetchPost() {
        try {
          const posts = await getPost('wpisy');
          setPostList(posts);
        } catch (error) {
          setError(error);
        }
      }
  
      fetchPost();
    }, []);
  
    return (
      <div>
        {postList.map((post, index) => (
          <Post key={post.id} post={post} />
        ))}
        {error && <div>Error: {error.message}</div>}
      </div>
    );
  }

export default PostList;
