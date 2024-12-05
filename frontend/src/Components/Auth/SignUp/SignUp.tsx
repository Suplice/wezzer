import React, { useState } from "react";
import SocialAuthButtons from "../../SocialAuthButtons/SocialAuthButtons";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { motion } from "motion/react";
import { useAuth } from "../../../Context/AuthContext";
import { ApiResponse, RegisterData } from "../../../utils/models";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp: React.FC = () => {
  const [buttonState, setButtonState] = useState<"Disabled" | "Enabled">(
    "Enabled"
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const navigate = useNavigate();

  const { registerWithEmailAndPassword } = useAuth();

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .min(8)
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/,
        "Password must contain at least one capital letter, one number and one special character"
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const signUpValidation = async (data: RegisterData) => {
    setButtonState("Disabled");
    const response: ApiResponse = await registerWithEmailAndPassword({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    setButtonState("Enabled");

    if (response.result) {
      toast.success(response.message);
      navigate("/");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="flex flex-row w-full h-screen ">
      <div className="md:w-1/2 w-full h-full md:p-4 p-6 xl:px-32 lg:px-12 flex justify-between flex-col ">
        <img
          src="/Logo.jpg"
          alt="logo"
          width="60px"
          className="rounded-xl flex-shrink-0 hover:cursor-pointer select-none"
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

          <form
            autoComplete="off"
            className="flex flex-col gap-1 "
            onSubmit={handleSubmit(signUpValidation)}
          >
            <label className="flex items-center text-xl font-semibold">
              Name <p className="text-red-700 ml-1"> *</p>
            </label>
            <input
              type="text"
              className={`border h-12 rounded-sm pl-4 outline-none text-xl focus:border-cyan-600 transition-all duration-150 ${
                errors.name ? "border-red-500 focus:border-red-300" : ""
              }`}
              {...register("name")}
            ></input>
            {errors.name && (
              <span className="text-red-500 text-sm font-semibold">
                {errors.name?.message}
              </span>
            )}
            <label className="flex items-center text-xl font-semibold mt-2">
              Email <p className="text-red-700 ml-1"> *</p>
            </label>
            <input
              type="email"
              className={`border h-12 rounded-sm outline-none pl-4 text-xl focus:border-cyan-600 transition-all duration-150 ${
                errors.email ? "border-red-500 focus:border-red-300" : ""
              }`}
              {...register("email")}
            ></input>
            {errors.email && (
              <span className="text-red-500 text-sm font-semibold">
                {errors.email?.message}
              </span>
            )}
            <label className="flex items-center text-xl font-semibold mt-2">
              Password <p className="text-red-700 ml-1"> *</p>
            </label>
            <div
              className={`border h-12 rounded-sm outline-none pl-4  focus-within:border-cyan-600 transition-all duration-150 flex items-center ${
                errors.password
                  ? "border-red-500 focus-within:border-red-300"
                  : ""
              } `}
            >
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="   outline-none  text-xl w-full focus:border-cyan-600 transition-all duration-150"
                {...register("password")}
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
            {errors.password && (
              <span className="text-red-500 text-sm font-semibold">
                {errors.password?.message}
              </span>
            )}
            <label className="flex items-center text-xl font-semibold mt-2">
              Confirm Password <p className="text-red-700 ml-1"> *</p>
            </label>
            <div
              className={`border h-12 rounded-sm outline-none pl-4  focus-within:border-cyan-600 transition-all duration-150 flex items-center ${
                errors.confirmPassword
                  ? "border-red-500 focus-within:border-red-300"
                  : ""
              }`}
            >
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                className="   outline-none  text-xl w-full focus:border-cyan-600 transition-all duration-150"
                {...register("confirmPassword")}
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
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm font-semibold">
                {errors.confirmPassword?.message}
              </span>
            )}
            <button
              type="submit"
              disabled={buttonState === "Disabled"}
              className={`mt-6 border h-12 rounded-md bg-cyan-500 hover:bg-cyan-600 transition-all duration-150 text-xl font-semibold ${
                buttonState === "Disabled"
                  ? "bg-gray-400 hover:bg-gray-500"
                  : ""
              }`}
            >
              {buttonState === "Disabled" ? "Signing up..." : "Sign Up"}
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
        <img
          src="/SignUpImage.jpg "
          className="rounded-lg w-[450px] aspect-square select-none"
        ></img>
      </div>
    </div>
  );
};

export default SignUp;
