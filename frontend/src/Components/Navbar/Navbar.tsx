import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="bg-sky-600 h-[72px] w-screen md:px-8 px-4">
      <div className=" h-[72px] flex flex-row justify-between mx-auto max-w-7xl items-center ">
        <div className="flex flex-row items-center justify-center  gap-3  ">
          <img
            src="/LogoLight.jpg"
            alt="logo"
            width="40px"
            className="rounded-xl flex-shrink-0 hover:cursor-pointer aspect-square"
            onClick={() => {
              window.location.href = "/";
            }}
          ></img>
          <p className="font-bold text-white text-2xl">Wezzer</p>
        </div>
        <div className="flex">
          <a
            href="/login"
            className="bg-white  text-xs md:text-base text-black px-5 md:px-8 py-2 font-bold rounded md:rounded-md  transition-all hover:bg-gray-200"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
