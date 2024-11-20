import "./AddRoomForm.css";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaImages } from "react-icons/fa";
interface AddRoomFormProps {
  onClose: () => void;
}

const AddRoomForm: React.FC<AddRoomFormProps> = ({ onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-md w-full h-full px-2 md:px-0"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
        exit={{ y: -50, opacity: 0, transition: { duration: 0.3 } }}
        className="bg-white rounded-lg p-6  sm:w-1/2 lg:w-1/3 shadow-lg    "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row  justify-between mb-4 items-center">
          <h2 className="text-xl font-bold  text-center ">Create Room</h2>
          <button
            onClick={onClose}
            className=" text-gray-400 hover:text-gray-600 text-xl pb-3"
          >
            x
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
            <label className=" text-sm font-medium">Room Description</label>
            <textarea
              className="border w-full  outline-none p-2 resize-none border-gray-300  focus:ring-blue-500 focus:ring-2 rounded"
              cols={10}
              rows={3}
            ></textarea>
          </div>
          <div className="flex items-center justify-center w-full h-[200px] flex-col  mb-2 hover:cursor-pointer custom-dashed-border hover:bg-gray-100 border-gray-400 gap-4">
            <FaImages size={38} />
            <label className="text-xl font-semibold">
              Drag images here or select new files
            </label>
            <input
              ref={fileInputRef}
              type="image"
              accept=".jpg, .jpeg"
              className="w-full hidden"
            />
          </div>
          <div className="flex flex-row items-center  mb-2">
            <p className=" text-lg font-semibold">Selected Image: </p>
            <p className="text-lg ml-2"> {selectedImage}</p>
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
