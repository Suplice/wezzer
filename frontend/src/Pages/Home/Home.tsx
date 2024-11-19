import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import MainField from "../../Components/MainField/MainField";
import "../../index.css";

const Home: React.FC = () => {
  return (
    <div className=" bg-gray-100 no-scroll  ">
      <Navbar />
      <MainField />
    </div>
  );
};

export default Home;
