import { GetCom, deletePost } from '../../firebase';
import React, { useEffect, useState, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import './com.css';
import { AuthContext } from '../../context/AuthContext';
function Com(Com) {
  const { currentUser } = useContext(AuthContext);

export function Com({ ComId, ComText }) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible);
  };

  const handleDeleteClick = () => {
    // Obsługa usuwania komentarza
    if (deletePost('com', Com.Com.id)) {
      window.location.reload();
    }
  };

  return (
    <div>
        {currentUser.uid === Com.Com.UID && (
          <DeleteIcon className="deleteIcon" onClick={handleDeleteClick} />
        )}
      <div className="comContainer">
        {isOptionsVisible && (
          <DeleteIcon className="deleteIcon" onClick={handleDeleteClick} />
        )}
        <div onClick={toggleOptions}>
          {ComText}
        </div>
      </div>
    </div>
  );
}

function RenderCom(id) {
  const [baseCom, setPostList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const coms = await GetCom('com', id.id);
        setPostList(coms);
      } catch (error) {
        setError(error);
      }
    }

    fetchPost();
  }, []);

  return (
    <div className="getCom">
      {baseCom.map((post, index) => (
        <div id={post.id} key={index}>
          <div>
            <Com Com={post} />
            {post.ComText}
          </div>
        </div>
      ))}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

export { RenderCom };

export default RenderCom;