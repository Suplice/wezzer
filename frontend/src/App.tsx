import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import Layout from "./Components/Layout/Layout";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
