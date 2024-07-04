import { Navigate, Route, Routes } from "react-router-dom";

import DefaultLayout from "@/layouts/default";
import DashboardPage from "@/pages/dashboard";
import DeviceDetailsPage from "@/pages/device";
import DevicesPage from "@/pages/devices";

const App = () => {
	return (
		<Routes>
			<Route element={<DefaultLayout />}>
				<Route
					index
					element={<Navigate to="/dashboard" replace={true} />}
					path="/"
				/>
				<Route element={<DashboardPage />} path="/dashboard" />
				<Route element={<DevicesPage />} path="/devices" />
				<Route element={<DeviceDetailsPage />} path="/devices/:deviceId" />
			</Route>
		</Routes>
	);
};

// const Home = () => {
// 	const { isAuthenticated, isLoading } = useAuth0();
//
// 	if (isLoading) {
// 		return (
// 			<div className="flex h-screen items-center justify-center">
// 				<Spinner color="primary" label="Loading..." size="lg" />
// 			</div>
// 		);
// 	}
//
// 	return isAuthenticated ? <Navigate to="/dashboard" /> : <IndexPage />;
// };

export default App;
