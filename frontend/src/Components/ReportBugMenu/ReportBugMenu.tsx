import { motion } from "motion/react";
import React from "react";

const ReportBugMneu = () => {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-md w-full h-full px-2 md:px-0 ">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
        exit={{ y: -50, opacity: 0, transition: { duration: 0.3 } }}
        className="xl:w-2/5 lg:w-3/5 md:w-3/5 sm:w-4/5 w-full flex items-center bg-white md:h-3/5 h-4/5 rounded-lg p-3 flex-col   "
      >
        <form>
          <label>Title</label>
          <input></input>
          <label>Description</label>
          <input></input>

          <button type="submit"> Send </button>
          <button> Cancel </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportBugMneu;
