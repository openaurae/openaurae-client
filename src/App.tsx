import { Route, Routes } from "react-router-dom";

import DefaultLayout from "@/layouts/default";
import DashboardPage from "@/pages/dashboard";
import DeviceDetailsPage from "@/pages/device";
import DevicesPage from "@/pages/devices";
import { withAuthenticationRequired } from "@auth0/auth0-react";

const App = () => {
	return (
		<Routes>
			<Route element={<DefaultLayout />}>
				<Route index element={<DashboardPage />} path="/" />
				<Route element={<DevicesPage />} path="/devices" />
				<Route element={<DeviceDetailsPage />} path="/devices/:deviceId" />
			</Route>
		</Routes>
	);
};

export default withAuthenticationRequired(App);
