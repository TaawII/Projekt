import React, { useState, useEffect, useContext } from 'react';
import './post.css';
import { getPost, addCom, updatePost, deletePost } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import { RenderCom } from './com.js';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import { Avatar } from "@mui/material"

function Post({ post }) {
  const { currentUser } = useContext(AuthContext);
  const [comment, setComment] = useState(post.Tresc);
  const [isEditing, setIsEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleShowFooter = () => {
    setShowComments(!showComments);
  };

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
    updatePost('wpisy', post.id, newData);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    deletePost('wpisy', post.id);
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
    addCom('com', ComData);
    setNewComment('');
  };

  return (
    <div id={post.id} className="post">
      <div className="userPost">
      
       <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />

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
      <div className="post__footer">
        <ThumbUpIcon fontSize="small" />
        <ChatBubbleOutlineIcon fontSize="small" onClick={handleShowFooter} style={{ cursor: 'pointer' }} />
        <RepeatIcon fontSize="small" />
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

            <div className="comPost">
        {isEditing ? (
          <button onClick={handleSaveClick} className="save">
            Zapisz
          </button>
        ) : null}
        {showComments && (
          <div className="comPostRender">
            <RenderCom id={post.id} />
          </div>
        )}
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