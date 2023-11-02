import React from "react";
import "./profil.css";
import Panel from "../home/panel-boczny";
import PokazProfil from "./pokaz-profil";
import PrawoProfil from "./prawo-profil";
import { useParams } from "react-router-dom";

const Profil = () => {
  return (
    <div className="home">
      <>
        <div className="homeContainer">
        {
        <Panel/>
        }
        {
        <PokazProfil />
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
