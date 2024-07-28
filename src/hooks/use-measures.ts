import useSWR from "swr";

import { useAuth0User } from "@/hooks/use-user";
import type { MeasureMetadata } from "@/types";
import { formatDate } from "@/utils/datetime";
import { get } from "@/utils/query";

export interface UseMeasuresParams {
	deviceId: string;
	sensorId: string;
	sensorType: string;
	name: string;
	date: string | Date;
	processed: boolean;
	order: "asc" | "desc";
	page?: number;
	count?: number;
}

export interface Measure {
	time: string;
	value: number | boolean;
}

export const useMeasures = ({
	deviceId,
	sensorId,
	sensorType,
	name,
	date,
	page,
	count,
	order,
	processed = true,
}: UseMeasuresParams) => {
	const { accessToken } = useAuth0User();

	const { data, isLoading, error } = useSWR(
		accessToken
			? {
					url: "/measures",
					accessToken,
					deviceId,
					sensorId,
					sensorType,
					name: name,
					date: formatDate(date),
					processed,
					page,
					count,
					order,
				}
			: null,
		get<Measure[]>,
	);

	return {
		measures: data,
		isLoading,
		error,
	};
};

export const useMeasureMetadata = async () => {
	const { accessToken } = useAuth0User();

	const { data, isLoading, error } = useSWR(
		accessToken
			? {
					url: "/metadata/measures",
					accessToken,
				}
			: null,
		get<MeasureMetadata[]>,
	);

	const metas = data || [];
	const map = new Map<string, MeasureMetadata>();

	for (const metadata of metas) {
		map.set(metadata.id, metadata);
	}

	return {
		measureMetas: map,
		isLoading,
		error,
	};
};
