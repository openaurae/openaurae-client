import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "./provider";

const root = document.getElementById("root");

if (!root) {
	throw new Error("root not found");
}

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider>
				<App />
			</Provider>
		</BrowserRouter>
	</React.StrictMode>,
);
