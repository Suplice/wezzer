import { Tooltip } from "@mantine/core";
import { motion } from "motion/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

interface ReportBugMenuProps {
  onClose: () => void;
}

const ReportBugMenu: React.FC<ReportBugMenuProps> = ({ onClose }) => {
  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (e.target === document.querySelector(".fixed")) {
        onClose();
      }
    });

    return () => {
      document.removeEventListener("click", (e) => {
        if (e.target === document.querySelector(".fixed")) {
          onClose();
        }
      });
    };
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmitForm = () => {
    // TODO: Send email to the backend
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-md w-full h-full  ">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
        exit={{ y: -50, opacity: 0, transition: { duration: 0.3 } }}
        className="flex items-center bg-white  rounded-lg p-6 flex-col max-w-[72rem] w-full mx-2 "
      >
        <div className="flex md:flex-row flex-col w-full h-full bg-blue-500/95 p-12 gap-10 md:gap-0">
          <div className="md:w-1/2 w-full  text-white flex flex-col gap-4">
            <h1 className="text-4xl font-bold">Report Bug</h1>
            <p className="text-md text-wrap max-w-[18rem]">
              Leave your email and we will try to get back to you within 24
              hours.
            </p>
            <div className="flex flex-row gap-4 relative z-20">
              <Tooltip
                label="Contact me on github"
                className="z-20"
                withinPortal
              >
                <span>
                  <FaGithub
                    color="white"
                    size={24}
                    className="hover:cursor-pointer"
                    onClick={() => window.open("https://github.com/Suplice")}
                  />
                </span>
              </Tooltip>
              <Tooltip label="Contact me via e-mail" withinPortal>
                <span>
                  <MdEmail
                    color="white"
                    size={24}
                    className="hover:cursor-pointer"
                    onClick={() =>
                      window.open("mailto:mateuszsuplice@gmail.com")
                    }
                  />
                </span>
              </Tooltip>
            </div>
          </div>
          <form
            className="flex flex-col  h-full justify-between md:w-1/2 w-full bg-white rounded-lg p-6 "
            onSubmit={handleSubmit(handleSubmitForm)}
          >
            <div className="flex flex-col ">
              <label className="text-lg font-semibold flex flex-row">
                <p>Email </p>
                <p className="text-red-500 ml-[3px]">*</p>
              </label>
              <input
                {...register("email", {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                })}
                className="outline-none border rounded-md p-1 px-3 focus:border-blue-400"
                placeholder="your@email.com"
              ></input>
              {errors.email && (
                <p className="text-red-500">
                  Email is required and must be a valid email
                </p>
              )}
              <label className="text-lg font-semibold flex flex-row mt-2">
                <p>Name </p>
                <p className="text-red-500 ml-[3px]">*</p>
              </label>
              <input
                {...register("name", { required: true })}
                className="outline-none border rounded-md p-1 px-3 focus:border-blue-400"
                placeholder="Your Name"
              ></input>
              {errors.name && <p className="text-red-500">Name is required</p>}
              <label className="text-lg font-semibold flex flex-row mt-2">
                <p>Message</p>
                <p className="text-red-500 ml-[3px]">*</p>
              </label>
              <textarea
                {...register("message", { required: true })}
                className="outline-none border rounded-md p-2 px-3 focus:border-blue-400 resize-none"
                placeholder="Your Message"
              ></textarea>
              {errors.message && (
                <p className="text-red-500">message is required</p>
              )}
            </div>
            <div className="flex justify-end flex-row gap-3 ">
              <button
                type="submit"
                className="py-2 px-4 bg-white rounded-md border border-blue-500 hover:bg-blue-100/50 transition-all duration-200 text-blue-400 font-semibold mt-3 "
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportBugMenu;
