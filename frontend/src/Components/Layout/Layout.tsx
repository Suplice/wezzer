import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../../Pages/Home/Home";
import Room from "../../Pages/Room/Room";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/Home",
    element: <Home />,
  },
  {
    // TODO 404 page
    path: "*",
    element: <div>404</div>,
  },
  {
    path: "/r/:roomId",
    element: <Room />,
  },
]);

const Layout: React.FC = ({}) => {
  return <RouterProvider router={router} />;
};

export default Layout;
