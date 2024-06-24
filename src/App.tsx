import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";

import AboutPage from "@/pages/about";
import DashboardPage from "@/pages/dashboard";
import DevicesPage from "@/pages/devices";
import IndexPage from "@/pages/index";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Routes>
      <Route
        element={isAuthenticated ? <DashboardPage /> : <IndexPage />}
        path="/"
      />
      <Route element={<DevicesPage />} path="/devices" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
