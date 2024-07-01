import useSWR from "swr";

import { useAuth0User } from "@/hooks/use-user";
import { formatDate } from "@/utils/datetime";
import { get } from "@/utils/query";

export interface UseMetricsParams {
	deviceId: string;
	sensorId: string;
	sensorType: string;
	metric: string;
	date: string | Date;
	processed: boolean;
	order: "asc" | "desc";
	limit?: number;
}

export interface Metric {
	time: string;
	value: number | boolean;
}

export const useMetrics = ({
	deviceId,
	sensorId,
	sensorType,
	metric,
	date,
	limit,
	order,
	processed = true,
}: UseMetricsParams) => {
	const { accessToken } = useAuth0User();

	const { data, isLoading, error } = useSWR(
		accessToken
			? {
					url: "/metrics",
					accessToken,
					deviceId,
					sensorId,
					sensorType,
					metric,
					date: formatDate(date),
					processed,
					limit,
					order: order,
				}
			: null,
		get<Metric[]>,
	);

	return {
		metrics: data,
		isLoading,
		error,
	};
};
