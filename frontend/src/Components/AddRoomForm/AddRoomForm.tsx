import "./AddRoomForm.css";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaImages } from "react-icons/fa";
import { CgPlayListRemove } from "react-icons/cg";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

interface AddRoomFormProps {
  onClose: () => void;
}

const AddRoomForm: React.FC<AddRoomFormProps> = ({ onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileDivInputRef = useRef<HTMLDivElement>(null);
  const [dragStatus, setDragStatus] = useState<"default" | "valid" | "invalid">(
    "default"
  );

  const { user } = useAuth();

  const handleButtonState = () => {
    if (!user?.id) {
      return "NotAuthenticated";
    } else if (user?.guest) {
      return "Guest";
    }

    return "Enabled";
  };

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [buttonState, setButtonState] = useState<
    "Disabled" | "Enabled" | "NotAuthenticated" | "Guest"
  >(handleButtonState);

  const navigate = useNavigate();

  const schema = yup.object().shape({
    roomName: yup.string().required("Room Name is required"),
    roomDescription: yup.string().required("Room Description is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const AddRoomValidation = async (data: any) => {
    setButtonState("Disabled");

    const fileName = selectedFile ? selectedFile.name : "Logo.jpg";

    const formData = new FormData();

    formData.append("file", selectedFile as Blob);

    formData.append("roomName", data.roomName);
    formData.append("roomDescription", data.roomDescription);
    formData.append("roomBackground", fileName);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_URL}/api/createRoom`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Room created successfully");

        console.log(result);
        navigate(`/r/${result[0].RoomId}/${result[0].Name}`);
      } else {
        toast.error("Failed to create room, please try again");
        console.error(result);
      }

      setButtonState("Enabled");
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (selectedImage) {
      return;
    }
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.items[0];
    if (file) {
      const isValid = file.type === "image/jpeg" || file.type === "image/jpg";
      setDragStatus(isValid ? "valid" : "invalid");
    }
  };

  const handleDragLeave = () => {
    setDragStatus("default");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.items[0]?.getAsFile();
    if (file) {
      const isValid = file.type === "image/jpeg" || file.type === "image/jpg";
      setDragStatus("default");

      if (isValid) {
        setSelectedImage(file.name);
        setSelectedFile(file);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("dragover", (e) => e.preventDefault());
    document.addEventListener("drop", (e) => e.preventDefault());
  }, []);

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-md w-full h-full px-2 md:px-0"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
        exit={{ y: -50, opacity: 0, transition: { duration: 0.3 } }}
        className="bg-white rounded-lg p-8 sm:w-1/2 lg:w-1/3 shadow-lg "
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between mb-4 items-center">
          <h2 className="text-xl font-bold text-center">Create Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl pb-3"
          >
            x
          </button>
        </div>

        <form autoComplete="off" onSubmit={handleSubmit(AddRoomValidation)}>
          <div className="mb-4">
            <label className="text-sm font-medium flex flex-row items-center">
              <p>Room Name</p>
              <p className="ml-1 text-red-600 text-sm">*</p>
            </label>
            <input
              {...register("roomName")}
              type="text"
              id="roomName"
              className={`w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none   ${
                errors.roomName
                  ? "border-red-500 focus:border-red-300"
                  : "focus:ring-2"
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium flex flex-row items-center">
              <p>Room Description</p>
              <p className="ml-1 text-red-600 text-sm">*</p>
            </label>
            <textarea
              {...register("roomDescription")}
              className={`border w-full outline-none p-2 resize-none border-gray-300   rounded ${
                errors.roomDescription
                  ? "border-red-500 focus:border-red-300"
                  : "focus:ring-2"
              }`}
              cols={10}
              rows={3}
            ></textarea>
          </div>
          <label className="text-sm font-medium mb-1">Background image</label>
          <div
            className={`flex items-center justify-center w-full h-[200px] flex-col mb-2 hover:cursor-pointer custom-dashed-border transition-all relative gap-4 ${
              dragStatus === "valid"
                ? "bg-blue-100 border-blue-500 text-blue-600"
                : dragStatus === "invalid"
                ? "bg-red-100 border-red-500 text-red-600"
                : "border-gray-400 hover:bg-gray-100"
            }`}
            ref={fileDivInputRef}
          >
            {selectedImage !== "" ? (
              <img
                src={selectedFile ? URL.createObjectURL(selectedFile) : ""}
                alt="room"
                className="w-full h-full object-fill "
              />
            ) : (
              <>
                <FaImages size={38} />
                <label className="text-xl font-semibold text-center">
                  Drag images here or click to select new files
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg, .jpeg"
                  className="w-full hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setSelectedImage(file.name);
                      setSelectedFile(file);
                    }
                  }}
                />
              </>
            )}

            <div
              className="absolute w-full h-full"
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnter={handleDragOver}
              onClick={handleClick}
            ></div>
          </div>
          <div className="flex flex-row items-center mb-2">
            <p className="text-lg font-semibold">Selected Image: </p>
            <p className="text-lg ml-2 truncate "> {selectedImage}</p>
            <CgPlayListRemove
              onClick={() => {
                setSelectedImage("");
                setSelectedFile(null);
              }}
              size={24}
              className={`pt-2 ml-1 hover:cursor-pointer text-red-600 ${
                selectedImage ? "" : "hidden"
              }`}
            />
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
              onClick={(e) => {
                if (buttonState === "NotAuthenticated") {
                  e.stopPropagation();
                  navigate("/login");
                } else if (buttonState === "Guest") {
                  e.stopPropagation();
                  navigate("/signup");
                }
              }}
              type={buttonState === "Disabled" ? "button" : "submit"}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {buttonState === "Disabled"
                ? "Creating..."
                : buttonState === "NotAuthenticated"
                ? "Login"
                : buttonState === "Guest"
                ? "Sign Up"
                : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRoomForm;
