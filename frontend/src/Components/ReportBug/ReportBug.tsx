import React from "react";
import { FaBug } from "react-icons/fa";
import { Tooltip } from "@mantine/core";

interface ReportBugProps {
  handleOpenModal: () => void;
}

const ReportBug: React.FC<ReportBugProps> = ({ handleOpenModal }) => {
  return (
    <Tooltip label="Report a bug" position="left" withArrow>
      <div
        onClick={handleOpenModal}
        className="fixed bottom-12 right-12 w-12 h-12 bg-blue-500 rounded-lg hover:bg-blue-600 hover:cursor-pointer items-center justify-center text-white flex transition-all duration-200"
      >
        <FaBug size={28} />
      </div>
    </Tooltip>
  );
};

export default ReportBug;
