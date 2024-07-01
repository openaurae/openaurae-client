import { useAuth0 } from "@auth0/auth0-react";
import { Spinner } from "@nextui-org/spinner";
import { Navigate, Route, Routes } from "react-router-dom";

import DefaultLayout from "@/layouts/default";
import AboutPage from "@/pages/about";
import DashboardPage from "@/pages/dashboard";
import DeviceDetailsPage from "@/pages/device";
import DevicesPage from "@/pages/devices";
import IndexPage from "@/pages/index";

const App = () => {
	return (
		<Routes>
			<Route element={<DefaultLayout />}>
				<Route index element={<Home />} path="/" />
				<Route element={<DashboardPage />} path="/dashboard" />
				<Route element={<DevicesPage />} path="/devices" />
				<Route element={<DeviceDetailsPage />} path="/devices/:deviceId" />
				<Route element={<AboutPage />} path="/about" />
			</Route>
		</Routes>
	);
};

const Home = () => {
	const { isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Spinner color="primary" label="Loading..." size="lg" />
			</div>
		);
	}

	return isAuthenticated ? <Navigate to="/dashboard" /> : <IndexPage />;
};

export default App;
