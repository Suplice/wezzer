import { motion } from "motion/react";
import React from "react";

interface ReportBugMenuProps {
  onClose: () => void;
}

const ReportBugMenu: React.FC<ReportBugMenuProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-md w-full h-full  ">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
        exit={{ y: -50, opacity: 0, transition: { duration: 0.3 } }}
        className="flex items-center bg-white  rounded-lg p-6 flex-col max-w-[72rem] w-full mx-2 "
      >
        <div className="flex md:flex-row flex-col w-full h-full bg-blue-500/90 p-12">
          <div className="w-1/2 text-white text-3xl font-bold">Report Bug</div>
          <form className="flex flex-col  h-full justify-between w-1/2 bg-white rounded-lg p-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold flex flex-row">
                <p>Email </p>
                <p className="text-red-500 ml-[3px]">*</p>
              </label>
              <input
                className="outline-none border rounded-md p-1 px-3 focus:border-blue-400"
                placeholder="your@email.com"
              ></input>
              <label className="text-lg font-semibold flex flex-row">
                <p>Name </p>
                <p className="text-red-500 ml-[3px]">*</p>
              </label>
              <input
                className="outline-none border rounded-md p-1 px-3 focus:border-blue-400"
                placeholder="Your Name"
              ></input>
              <label className="text-lg font-semibold flex flex-row">
                <p>Message</p>
                <p className="text-red-500 ml-[3px]">*</p>
              </label>
              <textarea
                className="outline-none border rounded-md p-2 px-3 focus:border-blue-400 resize-none"
                placeholder="Your Message"
              ></textarea>
            </div>
            <div className="flex justify-end flex-row gap-3 ">
              <button
                type="submit"
                className="py-2 px-4 bg-white rounded-lg border border-blue-500 hover:border-blue-600 transition-all duration-200 "
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportBugMenu;
