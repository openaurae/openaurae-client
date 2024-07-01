import useSWR from "swr";

import { useAuth0User } from "@/hooks/use-user";
import type { Device } from "@/types";
import { get } from "@/utils/query";

export const useDevices = () => {
	const { accessToken } = useAuth0User();

	const { data, isLoading, error } = useSWR(
		accessToken ? { url: "/devices", accessToken } : null,
		get<Device[]>,
	);

	return {
		devices: data,
		isLoading,
		error,
	};
};
