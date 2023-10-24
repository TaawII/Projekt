import { collection } from "firebase/firestore/lite";
import { GetCom, deletePost} from '../../firebase'; 
import React, { useEffect, useState, useContext, createContext } from 'react';

function Com(){

}
   
function DeleteButton( ComId ) {
    console.log(ComId.ComId);
    const DeletePost = () => {
        if(deletePost('com', ComId.ComId))
        {
            window.location.reload();
        }
    };
    return (
        <div>
            <button onClick={DeletePost}>Usuń komentarz</button>
        </div>
    )
}


function RenderCom(id){
    const [baseCom, setPostList] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function fetchPost() {
            try {
                const coms = await GetCom('com',id.id);
                setPostList(coms);
            } catch (error) {
                setError(error);
            }
        }

        fetchPost();
    }, []);
    return (
        <div className="getCom">
            {
                baseCom.map((post, index) => (
                    <div id={post.id} key={index}>
                        <div>
                            <DeleteButton ComId = {post.id} />
                            {post.ComText}
                        </div>
                    </div>
                ))
            }
            {error && <div>Error: {error.message}</div>}
        </div>
    );
}

export {RenderCom}

export default Com;