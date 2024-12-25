import { motion } from "motion/react";
import React from "react";

interface ReportBugMenuProps {
  onClose: () => void;
}

const ReportBugMenu: React.FC<ReportBugMenuProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-md w-full h-full px-2 md:px-0 ">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
        exit={{ y: -50, opacity: 0, transition: { duration: 0.3 } }}
        className="xl:w-2/5 lg:w-3/5 md:w-3/5 sm:w-4/5 w-full flex items-center bg-white md:h-3/5 h-4/5 rounded-lg p-6 flex-col   "
      >
        <form className="flex flex-col w-full h-full justify-between">
          <div className="flex flex-col gap-2">
            <label>Title</label>
            <input className="outline-none border rounded-md p-1"></input>
            <label>Description</label>
            <input className="outline-none border rounded-md p-1"></input>
          </div>
          <div className="flex justify-end flex-row gap-3 ">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 rounded-sm hover:bg-blue-600 transition-all duration-200 "
            >
              Send
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="py-2 px-4 bg-gray-500 rounded-sm hover:bg-gray-600 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportBugMenu;
