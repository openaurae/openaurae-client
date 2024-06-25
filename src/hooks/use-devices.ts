import useSWR from "swr";

import { useAuth0User } from "@/hooks/use-user";
import { get } from "@/utils/query";

export interface Device {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  last_record?: string;
}

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
