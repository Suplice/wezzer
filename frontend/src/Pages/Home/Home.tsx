import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import MainField from "../../Components/MainField/MainField";

const Home: React.FC = () => {
  return (
    <div className="w-screen">
      <Navbar />
      <MainField />
      {/* <ReportBug /> */}
    </div>
  );
};

export default Home;
