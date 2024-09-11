import useSWR from "swr";

import { useAuth0User } from "@/hooks/use-user";
import type { Device, DeviceWithSensors } from "@/types";
import { get, postJson, putJson, remove } from "@/utils/query";

export const useDevices = () => {
	const { accessToken } = useAuth0User();

	const { data, isLoading, mutate, error } = useSWR(
		accessToken ? { url: "/devices", accessToken } : null,
		get<DeviceWithSensors[]>,
	);

	const addDevice = async (device: Device) => {
		console.log(device);
		await postJson({ url: "/devices", accessToken, ...device });
		mutate();
	};

	const updateDevice = async (device: Device) => {
		await putJson({ url: `/devices/${device.id}`, accessToken, ...device });
		mutate();
	};

	const removeDevice = async (device: Device) => {
		await remove({ url: `/devices/${device.id}`, accessToken });
		mutate();
	};

	return {
		devices: data,
		isLoading,
		error,
		addDevice,
		updateDevice,
		removeDevice,
	};
};
