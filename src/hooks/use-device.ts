import useSWR from "swr";

import { useAuth0User } from "@/hooks/use-user";
import type { DeviceWithSensors, SensorWithMetadata } from "@/types";
import { get } from "@/utils/query";

export function useDevice(deviceId: string) {
	const { accessToken } = useAuth0User();

	const { data, isLoading, error } = useSWR(
		accessToken ? { url: `/devices/${deviceId}`, accessToken } : null,
		get<DeviceWithSensors>,
	);

	return {
		device: data,
		isLoading,
		error,
	};
}

export function useDeviceSensor(deviceId: string, sensorId: string) {
	const { accessToken } = useAuth0User();

	const { data, isLoading, error } = useSWR(
		accessToken
			? { url: `/devices/${deviceId}/sensors/${sensorId}`, accessToken }
			: null,
		get<SensorWithMetadata>,
	);

	return {
		sensor: data,
		isLoading,
		error,
	};
}
