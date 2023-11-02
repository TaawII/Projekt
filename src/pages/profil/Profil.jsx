import React from "react";
import "./profil.css";
import Panel from "../home/panel-boczny";
import EdycjaProfilu from "./edycja-profilu";
import PrawoProfil from "./prawo-profil";

const Profil = () => {
  return (
    <div className="home">
      <>
        <div className="homeContainer">
        {
        <Panel/>
        }
        {
        <EdycjaProfilu />
        }
        {
        <PrawoProfil />
        }
        </div>
      </>
    </div>
  );
};

export default Profil;