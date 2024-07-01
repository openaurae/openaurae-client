import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";

export const useAuth0User = () => {
	const {
		user,
		isAuthenticated,
		getAccessTokenSilently,
		loginWithRedirect,
		logout,
	} = useAuth0();

	const { isLoading, data, error } = useSWR({ user }, () =>
		getAccessTokenSilently({
			authorizationParams: {
				audience: import.meta.env.VITE_AUTH0_AUDIENCE,
			},
		}),
	);

	return {
		isAuthenticated,
		isLoading,
		error,
		user,
		accessToken: data,
		login: () => loginWithRedirect(),
		logout: () =>
			logout({ logoutParams: { returnTo: window.location.origin } }),
	};
};
