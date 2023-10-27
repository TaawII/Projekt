import { GetCom, deletePost } from '../../firebase';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import './com.css';

export function Com({ ComId, ComText }) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible);
  };

  const handleDeleteClick = () => {
    // Obsługa usuwania komentarza
    if (deletePost('com', ComId)) {
      window.location.reload();
    }
  };

  return (
    <div>
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
            <Com ComId={post.id} />
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