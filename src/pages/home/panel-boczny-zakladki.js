import React from 'react';
import "./panel-boczny-zakladki.css"

function Zakladka({ Ikonka, tekst, onClick }){
    return(
        <div className="panelZakladki" onClick={onClick}>
            <Ikonka />
            <h2>{tekst}</h2>
        </div>
    );
}

export default Zakladka;