import React, { useState } from "react";
import SocialAuthButtons from "../SocialAuthButtons/SocialAuthButtons";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { motion } from "motion/react";

const SignUp: React.FC = () => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  return (
    <div className="flex flex-row w-full h-screen ">
      <div className="md:w-1/2 w-full h-full md:p-4 p-6 xl:px-32 lg:px-12 flex justify-between flex-col ">
        <img
          src="/Logo.jpg"
          alt="logo"
          width="60px"
          className="rounded-xl flex-shrink-0 hover:cursor-pointer"
          onClick={() => {
            window.location.href = "/";
          }}
        ></img>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          className="mt-10"
        >
          <h1 className="font-bold text-3xl pb-6">Sign Up</h1>

          <form className="flex flex-col gap-1 ">
            <label className="flex items-center text-xl font-semibold">
              Name <p className="text-red-700 ml-1"> *</p>
            </label>
            <input
              type="text"
              className="border h-12 rounded-sm pl-4 outline-none text-xl focus:border-cyan-600 transition-all duration-150"
            ></input>
            <label className="flex items-center text-xl font-semibold mt-2">
              Email <p className="text-red-700 ml-1"> *</p>
            </label>
            <input
              type="email"
              className="border h-12 rounded-sm outline-none pl-4 text-xl focus:border-cyan-600 transition-all duration-150"
            ></input>
            <label className="flex items-center text-xl font-semibold mt-2">
              Password <p className="text-red-700 ml-1"> *</p>
            </label>
            <div className="border h-12 rounded-sm outline-none pl-4  focus:border-cyan-600 transition-all duration-150 flex items-center">
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="   outline-none  text-xl w-full focus:border-cyan-600 transition-all duration-150"
              ></input>
              {isPasswordVisible ? (
                <FaEyeSlash
                  size={24}
                  className="mx-4 hover:cursor-pointer"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                />
              ) : (
                <FaEye
                  size={24}
                  className="mr-4 hover:cursor-pointer"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                />
              )}
            </div>
            <label className="flex items-center text-xl font-semibold mt-2">
              Confirm Password <p className="text-red-700 ml-1"> *</p>
            </label>
            <div className="border h-12 rounded-sm outline-none pl-4  focus:border-cyan-600 transition-all duration-150 flex items-center">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                className="   outline-none  text-xl w-full focus:border-cyan-600 transition-all duration-150"
              ></input>
              {isConfirmPasswordVisible ? (
                <FaEyeSlash
                  size={24}
                  className="mx-4 hover:cursor-pointer"
                  onClick={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                />
              ) : (
                <FaEye
                  size={24}
                  className="mr-4 hover:cursor-pointer"
                  onClick={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                />
              )}
            </div>
            <button
              disabled={buttonDisabled}
              className={`mt-6 border h-12 rounded-md bg-cyan-500 hover:bg-cyan-600 transition-all duration-150 text-xl font-semibold ${
                buttonDisabled ? "bg-gray-400 hover:bg-gray-500" : ""
              }`}
            >
              Register
            </button>
          </form>
          <button className="border h-12 rounded-md bg-blue-400 w-full mt-6 font-semibold text-xl hover:bg-blue-500 transition-all duration-150">
            Sign In as Guest
          </button>
          <p className="text-center mt-5 font-serif">Or sign up using:</p>

          <div className="w-full">
            <SocialAuthButtons />
          </div>

          <div className="flex md:flex-row flex-col ">
            <p className="mt-3">Already have an account?</p>
            <a
              href="/login"
              className="text-blue-500 hover:text-blue-700 md:ml-1 md:mt-3"
            >
              Log in here.
            </a>
          </div>
        </motion.div>
        <div className="font-semibold mt-5 pb-3">
          &#169; Wezzer 2024, all rights reserved.
          <a
            href="localhost:5173"
            className="text-blue-500 hover:text-blue-700 ml-1"
          >
            Wezzer
          </a>
        </div>
      </div>
      <div className="md:w-1/2 hidden md:flex justify-center items-center min-h-screen h-full bg-sky-600 px-5 fixed right-0">
        <img src="/SignUpImage.jpg " className="rounded-lg w-[450px]"></img>
      </div>
    </div>
  );
};

export default SignUp;
