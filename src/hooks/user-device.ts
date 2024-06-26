import useSWR from "swr";

import { useAuth0User } from "@/hooks/use-user";
import { Device, Sensor } from "@/types";
import { get } from "@/utils/query";

export interface DeviceWithSensors extends Device {
  sensors: Sensor[];
}

export const useDevice = (deviceId: string) => {
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
};
