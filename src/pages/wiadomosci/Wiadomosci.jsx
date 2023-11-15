import React from "react";
import "./wiadomosci.scss";
import Panel from "../home/panel-boczny";
import PokazWiadomosci from "./pokaz-wiadomosci";
import Prawo from "../home/prawo";

const Wiadomosci = () => {
    return (
        <div className="home">
            <>
              <div className="homeContainer">
                {
                    <Panel />
                }
                {
                    <PokazWiadomosci />
                }
                {
                    <Prawo />
                }
                </div>
            </>
        </div>
    );
};

export default Wiadomosci;