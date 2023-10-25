import { collection } from "firebase/firestore/lite";
import { GetCom, deletePost } from '../../firebase';
import React, { useEffect, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Com({ ComId }) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible);
  };

  const handleEditClick = () => {
    // Obsługa edycji komentarza
    console.log("Edytuj komentarz");
  };

  const handleDeleteClick = () => {
    // Obsługa usuwania komentarza
    if (deletePost('com', ComId)) {
      window.location.reload();
    }
  };

  return (
    <div>
      <div onClick={toggleOptions}>
        <ArrowDropDownIcon />
      </div>
      {isOptionsVisible && (
        <div>
          <button onClick={handleEditClick}>Edytuj</button>
          <button onClick={handleDeleteClick}>Usuń</button>
        </div>
      )}
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
