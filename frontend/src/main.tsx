import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import SignUp from "./Components/SignUp/SignUp.tsx";
import SignIn from "./Components/SignIn/SignIn.tsx";
import Home from "./Pages/Home/Home.tsx";

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
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
