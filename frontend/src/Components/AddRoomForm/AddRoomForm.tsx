import { AnimatePresence, motion } from "motion/react";
import React from "react";

interface AddRoomFormProps {
  onClose: () => void;
}

const AddRoomForm: React.FC<AddRoomFormProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
        exit={{ y: -50, opacity: 0, transition: { duration: 0.3 } }}
        className="bg-white rounded-lg p-6 w-11/12 sm:w-1/2 lg:w-1/3 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold mb-4">Create Room</h2>
          <button
            onClick={onClose}
            className=" text-gray-400 hover:text-gray-600"
          >
            X
          </button>
        </div>

        <form>
          <div className="mb-4">
            <label className=" text-sm font-medium">Room Name</label>
            <input
              type="text"
              id="roomName"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className=" text-sm font-medium">Room Name</label>
            <textarea
              className="border w-full  outline-none p-2 resize-none border-gray-300  focus:ring-blue-500 focus:ring-2 rounded"
              cols={10}
              rows={5}
            >
              dada
            </textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRoomForm;
