import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Avatar } from "@mantine/core";
import { AnimatePresence, motion } from "motion/react";
import { FaPowerOff } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, signOutAsGuest } = useAuth();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const naviagte = useNavigate();

  const handleLogout = async () => {
    if (user?.guest) {
      const response = await signOutAsGuest();
      if (response.result) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      naviagte("/login");
      return;
    }

    const response = await logout();
    if (response.result) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    naviagte("/login");
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const menu = document.getElementById("menu");
      const avatar = document.getElementById("avatar");
      if (
        menu &&
        !menu.contains(e.target as Node) &&
        avatar &&
        !avatar.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div className="bg-sky-600 h-[72px] w-full md:px-8 px-4 sticky z-10 m-0 top-0">
      <div className=" h-[72px] flex flex-row justify-between mx-auto max-w-7xl items-center ">
        <div className="flex flex-row items-center justify-center  gap-3  ">
          <img
            src="/LogoLight.jpg"
            alt="logo"
            width="40px"
            className="rounded-xl flex-shrink-0 hover:cursor-pointer aspect-square select-none"
            onClick={() => {
              window.location.href = "/";
            }}
          ></img>
          <p className="font-bold text-white text-2xl">Wezzer</p>
        </div>
        <div className="flex relative">
          {isAuthenticated ? (
            <>
              <Avatar
                variant="filled"
                radius="xl"
                size={45}
                color="violet"
                name={user?.name}
                className="hover:cursor-pointer select-none"
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                }}
                id="avatar"
              ></Avatar>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.3 },
                    }}
                    exit={{
                      y: -20,
                      opacity: 0,
                      transition: { duration: 0.3 },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={`absolute w-[180px] flex flex-col gap-2 bg-white z-10  rounded-md shadow-lg top-12 right-0 mx-auto p-2 `}
                    id="menu"
                  >
                    <p className="text-sm text-center">Hello, {user?.name}</p>
                    <div onClick={handleLogout}>
                      <button className="text-red-500 rounded-md p-1 text-left flex flex-row gap-3 items-center hover:bg-red-100/50 w-full pr-6 pl-2">
                        <FaPowerOff />
                        <p className="text-md font-semibold">Logout</p>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
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
