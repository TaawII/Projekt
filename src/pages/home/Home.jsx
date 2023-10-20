import React from "react";
import "./home.css";
import Panel from "./panel-boczny";
import Srodek from "./srodek";
import Prawo from "./prawo";

const Home = () => {
  return (
    <div className="home">
      <>
        <div className="homeContainer">
        {
        <Panel/>
        }
        {
       <Srodek/>
        }
        {
       <Prawo/>
        }
        </div>
      </>
    </div>
  );
};

export default Home;
