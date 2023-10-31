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
import { addReaction, getReactionsFromDatabase, removeReaction } from '../../firebase';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';


function Post({ post }) {
  const { currentUser } = useContext(AuthContext);
  const [comment, setComment] = useState(post.Tresc);
  const [isEditing, setIsEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [reactions, setReactions] = useState({ like: 0 });
  const currentUserUID = currentUser.uid;

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

  const handleSaveClick = async () => {
    const newData = {
      Tresc: comment,
      Reactions: reactions,
    };
    updatePost('wpisy', post.id, newData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setComment(post.Tresc);
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
    if (newComment.trim() !== '') { 
      const userID = currentUser.uid; 
      const ComData = {
        PostId: post.id,
        ComText: newComment,
        Timestamp: new Date(),
        UserID: userID, 
      };
      addCom('com', ComData);
      setNewComment('');
    }
  };

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const fetchedReactions = await getReactionsFromDatabase(post.id);
        setReactions(fetchedReactions);
      } catch (error) {
        console.error('Błąd podczas pobierania reakcji:', error);
      }
    };

    fetchReactions();
  }, [post.id]);

  const handleLikeClick = async () => {
    const reactionType = 'lubie';
    const userID = currentUser.uid;

    if (reactions[reactionType]) {
      try {
        await removeReaction('wpisy', post.id, userID, reactionType);
        const fetchedReactions = await getReactionsFromDatabase(post.id, currentUserUID);
        setReactions(fetchedReactions);
      } catch (error) {
        console.error('Błąd podczas usuwania reakcji:', error);
      }
    } else {
      try { 
        await addReaction('wpisy', post.id, userID, reactionType);
        const fetchedReactions = await getReactionsFromDatabase(post.id, currentUserUID);
        setReactions(fetchedReactions);
      } catch (error) {
        console.error('Błąd podczas dodawania reakcji:', error);
      }
    }
  };

  return (
    <div id={post.id} className="post">
      <div className="userPost">
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
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
                <div>
                  <MenuItem onClick={handleSaveClick}>
                    <EditIcon />
                    Zapisz
                  </MenuItem>
                  <MenuItem onClick={handleCancelEdit}>
                    <EditIcon />
                    Anuluj
                  </MenuItem>
                </div>
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
          <textarea value={comment} onChange={handleCommentChange} className="editTextarea" />
        ) : (
          post.Tresc
        )}
      </div>
      <div className="post__footer">
        <div className="like-container" onClick={handleLikeClick}>
          <ThumbUpIcon fontSize="small" style={{ cursor: 'pointer' }} />
          <span>{reactions.like}</span>
        </div>
        <div className="reaction" onClick={handleShowFooter}>
          <ChatBubbleOutlineIcon fontSize="small" style={{ cursor: 'pointer' }} />
        </div>
        <div className="reaction">
          <RepeatIcon fontSize="small" />
        </div>
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
  <Post key={post.id} post={post} addCom={addCom} />
))}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

export default PostList;
