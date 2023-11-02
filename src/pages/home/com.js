import { GetCom, deletePost } from '../../firebase';
import React, { useEffect, useState, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import './com.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AuthContext } from '../../context/AuthContext';

export function Com({ ComId, ComText, Pseudonim, onDeleteClick, isAuthor }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const toggleOptions = (event) => {
    event.stopPropagation(); 
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteClick = () => {
    onDeleteClick(ComId);
    setAnchorEl(null);
  };

  const handleMouseEnter = () => {
    if (isAuthor) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`comContainer ${isHovered ? 'highlighted' : ''}`}
      onClick={toggleOptions}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <strong>{`${Pseudonim}:`}</strong> {ComText}
      </div>
      {isAuthor && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} onClick={(e) => e.stopPropagation()}>
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon />
            Usuń komentarz
          </MenuItem>
        </Menu>
      )}
    </div>
  );
}

function RenderCom(id) {
  const { currentUser } = useContext(AuthContext);
  const [baseCom, setBaseCom] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        if (id && id.id) {
          const coms = await GetCom('com', id.id);
          setBaseCom(coms);
        }
      } catch (error) {
        setError(error);
      }
    }

    fetchPost();
  }, [id.id]);

  const handleDeleteCom = async (comId) => {
    const commentToDelete = baseCom.find((com) => com.id === comId);

    if (commentToDelete && commentToDelete.UserID === currentUser.uid) {
      if (await deletePost('com', comId)) {
        setBaseCom((prevComs) => prevComs.filter((com) => com.id !== comId));
      }
    }
  };

  return (
    <div className="getCom">
      {baseCom.map((post, index) => (
        <Com
          key={post.id}
          ComId={post.id}
          ComText={post.ComText}
          Pseudonim={post.Pseudonim}
          onDeleteClick={handleDeleteCom}
          isAuthor={post.UserID === currentUser.uid} 
        />
      ))}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

export { RenderCom };

export default RenderCom;
