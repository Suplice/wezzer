import React from "react";
import { useAuth } from "../../Context/AuthContext";
import { Avatar } from "@mantine/core";

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="bg-sky-600 h-[72px] w-full md:px-8 px-4 sticky z-10 m-0 top-0">
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
          {isAuthenticated ? (
            <Avatar
              variant="filled"
              radius="xl"
              size={45}
              color="violet"
              name={user?.name}
            ></Avatar>
          ) : (
            <a
              href="/login"
              className="bg-white  text-xs md:text-base text-black px-5 md:px-8 py-2 font-bold rounded md:rounded-md  transition-all hover:bg-gray-200"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
