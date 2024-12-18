import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const swapColors = () => {
      const intervalId = setInterval(() => {
        const first = document.getElementById("first");
        const second = document.getElementById("second");
        const third = document.getElementById("third");
        if (first && second && third) {
          if (first.classList.contains("text-yellow-500")) {
            first.classList.remove("text-yellow-500");
            first.classList.add("text-white");
            second.classList.remove("text-white");
            second.classList.add("text-yellow-500");
          } else if (second.classList.contains("text-yellow-500")) {
            second.classList.remove("text-yellow-500");
            second.classList.add("text-white");
            third.classList.remove("text-white");
            third.classList.add("text-yellow-500");
          } else if (third.classList.contains("text-yellow-500")) {
            third.classList.remove("text-yellow-500");
            third.classList.add("text-white");
            first.classList.remove("text-white");
            first.classList.add("text-yellow-500");
          }
        }
      }, 1500);
      return intervalId;
    };

    const intervalId = swapColors();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center  bg-black">
      <h1 className="md:h-[500px]  ">
        <span id="first" className="text-white md:text-[360px] text-[140px]">
          4
        </span>
        <span
          id="second"
          className="text-yellow-500 md:text-[360px] text-[140px]"
        >
          0
        </span>
        <span id="third" className="text-white md:text-[360px] text-[140px] ">
          4
        </span>
      </h1>
      <h2 className="md:text-[60px] text-[20px] font-semibold text-white">
        SORRY, THERE'S
      </h2>
      <h2 className="md:text-[60px] text-[20px] font-semibold text-yellow-600">
        NOTHING HERE
      </h2>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 text-white border rounded-md mt-5 hover:bg-white hover:text-black transition-all duration-200"
      >
        Go back
      </button>
    </div>
  );
};

export default NotFound;
