import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { ToastContainer } from "react-toastify";
import Layout from "./Components/Layout/Layout";

function App() {
  return (
    <AuthProvider>
      <Layout />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
