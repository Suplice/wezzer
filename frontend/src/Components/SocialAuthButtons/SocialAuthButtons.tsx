import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SocialAuthButtons: React.FC = () => {
  return (
    <div className="flex flex-row mt-5  gap-5 text-center text-xl w-full flex-wrap">
      <div className="px-1 py-2 flex-1 border-2 rounded-md hover:cursor-pointer hover:border-black hover:scale-110 transition-all duration-150 flex flex-row items-center justify-center">
        <FcGoogle />
        <p className="ml-2 text-xl">Google</p>
      </div>
      <div className="px-1 py-2 flex-1 border-2 rounded-md hover:cursor-pointer hover:border-black hover:scale-110 transition-all duration-150 flex flex-row items-center justify-center">
        <FaFacebook color="blue" />
        <p className="ml-2 text-xl">Facebook</p>
      </div>
      <div className="px-1 py-2 flex-1 border-2 rounded-md hover:cursor-pointer hover:border-black hover:scale-110 transition-all duration-150 flex flex-row items-center justify-center">
        <FaGithub />
        <p className="ml-2 text-xl">Github</p>
      </div>
    </div>
  );
};

export default SocialAuthButtons;
