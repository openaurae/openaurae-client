import {
	Bar,
	BarChart,
	Line,
	LineChart,
	Rectangle,
	ResponsiveContainer,
	Tooltip,
	YAxis,
} from "recharts";

import {
	type Measure,
	type UseMeasuresParams,
	useMeasures,
} from "@/hooks/use-measures.ts";
import type { MeasureMetadata, Sensor } from "@/types";
import { formatDate, formatTime } from "@/utils/datetime";
import { Skeleton } from "@nextui-org/skeleton";

export interface FormattedMetric extends Measure {
	formattedValue: string;
	formattedTime: string;
}

export type MetricChartProps = {
	sensor: Sensor;
	measureMetadata: MeasureMetadata;
	scroll?: boolean;
} & Pick<UseMeasuresParams, "count" | "processed" | "date" | "order">;

export const MeasureChart = ({
	sensor,
	measureMetadata,
	date,
	count,
	processed,
	order,
	scroll = false,
}: MetricChartProps) => {
	const { isLoading, measures } = useMeasures({
		deviceId: sensor.device,
		sensorId: sensor.id,
		sensorType: sensor.type,
		name: measureMetadata.id,
		date: formatDate(date),
		processed,
		count,
		order,
	});
	const formatMetricValue = (value: boolean | number) => {
		return measureMetadata.is_bool
			? value
				? "Yes"
				: "No"
			: (value as number).toFixed(2) + (measureMetadata.unit || "");
	};

	if (isLoading) {
		return <Skeleton className="h-full w-full rounded" />;
	}
	if (!measures || measures.length === 0) {
		return (
			<div className="flex h-full flex-col items-center justify-center">
				<p className="text-default-500">No Data</p>
			</div>
		);
	}

	let data = measures.map((metric) => ({
		...metric,
		formattedTime: formatTime(metric.time),
		formattedValue: formatMetricValue(metric.value),
	}));

	if (order === "desc") {
		// always display data in asc order
		data = data.reverse();
	}

	const Chart = measureMetadata.is_bool ? MetricBarChart : MetricLineChart;

	return (
		<div
			style={{
				// 150px is the minimum width to render tooltip
				// otherwise avoid sparse charts by assigning fixed width (32px) to each dot/bar
				width: scroll ? `${Math.max(32 * measures.length, 150)}px` : "100%",
				height: "100%",
			}}
		>
			<Chart data={data} metricName={measureMetadata.id} />
		</div>
	);
};

interface ChartProps {
	metricName: string;
	data: FormattedMetric[];
}

const MetricBarChart = ({ metricName, data }: ChartProps) => {
	return (
		<ResponsiveContainer height="100%" width="100%">
			<BarChart
				data={data.map((val) => ({
					...val,
					value: val.value ? 1 : 0.1,
				}))}
			>
				<Bar
					activeBar={<Rectangle className="fill-blue-300" />}
					barSize={25}
					className="fill-blue-500"
					dataKey="value"
				/>
				<YAxis domain={[0, 1]} hide={true} />
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							const value: FormattedMetric = payload[0].payload;

							return (
								<ValueDetails
									formattedTime={value.formattedTime}
									formattedValue={value.formattedValue}
									metricName={metricName}
								/>
							);
						}

						return null;
					}}
					cursor={{ fill: "transparent" }}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};

const MetricLineChart = ({ metricName, data }: ChartProps) => {
	const values = data.map((metric) => metric.value) as number[];

	return (
		<ResponsiveContainer height="100%" width="100%">
			<LineChart data={data}>
				<Line
					className="fill-blue-500"
					dataKey="value"
					strokeWidth={2}
					type="monotone"
				/>
				<YAxis
					domain={[Math.min(...values), Math.max(...values)]}
					hide={true}
				/>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							const value: FormattedMetric = payload[0].payload;

							return (
								<ValueDetails
									formattedTime={value.formattedTime}
									formattedValue={value.formattedValue}
									metricName={metricName}
								/>
							);
						}

						return null;
					}}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

interface TooltipProps {
	formattedTime: string;
	formattedValue: string;
	metricName: string;
}

const ValueDetails = ({
	formattedTime,
	metricName,
	formattedValue,
}: TooltipProps) => {
	return (
		<div className="rounded-lg border bg-background p-2 shadow-sm">
			<div className="grid grid-cols-2 gap-2">
				<div className="flex flex-col">
					<span className="text-muted-foreground text-[0.70rem] uppercase">
						Time
					</span>
					<span className="font-bold">{formattedTime}</span>
				</div>
				<div className="flex flex-col">
					<span className="text-muted-foreground text-[0.70rem] uppercase">
						{metricName}
					</span>
					<span className="font-bold">{formattedValue}</span>
				</div>
			</div>
		</div>
	);
};
