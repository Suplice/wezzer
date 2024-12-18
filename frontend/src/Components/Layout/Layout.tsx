import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../../Pages/Home/Home";
import Room from "../../Pages/Room/Room";
import SignIn from "../Auth/SignIn/SignIn";
import SignUp from "../Auth/SignUp/SignUp";
import NotFound from "../../Pages/NotFound/NotFound";

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
    path: "/home",
    element: <Home />,
  },
  {
    // TODO 404 page
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/r/:roomId/:roomName",
    element: <Room />,
  },
]);

const Layout: React.FC = ({}) => {
  return <RouterProvider router={router} />;
};

export default Layout;
