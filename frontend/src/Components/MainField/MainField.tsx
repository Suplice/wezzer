import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import RoomManager from "../Room/RoomManager/RoomManager";
import AddRoomForm from "../AddRoomForm/AddRoomForm";
import { AnimatePresence } from "motion/react";
import "../../index.css";
import ReportBug from "../ReportBug/ReportBug";
import ReportBugMenu from "../ReportBugMenu/ReportBugMenu";

const MainField: React.FC = () => {
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isReportBugVisible, setIsReportBugVisible] = useState(false);

  useEffect(() => {}, [isAddFormVisible]);

  const closeForm = () => {
    setIsAddFormVisible(false);
  };

  const handleOpenReportBugMenu = () => {
    setIsReportBugVisible(true);
  };

  const closeReportBugMenu = () => {
    setIsReportBugVisible(false);
  };

  return (
    <>
      <div className="flex flex-col max-w-[1600px] mx-auto mt-5 h-full min-h-[calc(100vh-92px)] no-scroll ">
        <div className="flex flex-row justify-between px-6  ">
          <p className="font-semibold text-2xl">Browse Rooms</p>
          <button
            onClick={() => setIsAddFormVisible(true)}
            className="bg-green-600 rounded-full text-white pr-1 pl-1 sm:pr-3  py-1 flex flex-row gap-3 items-center justify-center hover:bg-green-500 transition-all"
          >
            <p className="rounded-full text-green-600 bg-white p-2 text-center  text-md font-semibold ">
              <FaPlus />
            </p>
            <p className="text-lg font-semibold hidden sm:flex">Create Room</p>
          </button>
        </div>
        <RoomManager />

        <div>dadada</div>
      </div>
      <AnimatePresence>
        {isAddFormVisible && <AddRoomForm onClose={closeForm} />}
        {isReportBugVisible && <ReportBugMenu onClose={closeReportBugMenu} />}
      </AnimatePresence>

      <ReportBug handleOpenModal={handleOpenReportBugMenu} />
    </>
  );
};

export default MainField;
