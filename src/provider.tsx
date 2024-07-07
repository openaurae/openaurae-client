import { Auth0Provider } from "@auth0/auth0-react";
import { NextUIProvider } from "@nextui-org/system";
import type React from "react";
import { useNavigate } from "react-router-dom";

export function Provider({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();

	const { VITE_AUTH0_CLIENT_ID, VITE_AUTH0_DOMAIN, VITE_AUTH0_AUDIENCE } =
		import.meta.env;

	return (
		<Auth0Provider
			authorizationParams={{
				redirect_uri: window.location.origin,
				audience: VITE_AUTH0_AUDIENCE,
			}}
			clientId={VITE_AUTH0_CLIENT_ID}
			domain={VITE_AUTH0_DOMAIN}
			onRedirectCallback={(appState) =>
				navigate(appState?.returnTo || window.location.pathname)
			}
		>
			<NextUIProvider navigate={navigate}>{children}</NextUIProvider>
		</Auth0Provider>
	);
}
