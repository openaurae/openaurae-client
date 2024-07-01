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

import { metricChart } from "@/components/primitives";
import {
	type Metric,
	type UseMetricsParams,
	useMetrics,
} from "@/hooks/use-metrics";
import type { MetricMeta, Sensor } from "@/types";
import { formatDate, formatTime } from "@/utils/datetime";
import { Skeleton } from "@nextui-org/skeleton";

export interface FormattedMetric extends Metric {
	formattedValue: string;
	formattedTime: string;
}

export type MetricChartProps = {
	sensor: Sensor;
	metricMeta: MetricMeta;
	scroll?: boolean;
} & Pick<UseMetricsParams, "limit" | "processed" | "date" | "order">;

export const MetricChart = ({
	sensor,
	metricMeta,
	date,
	limit,
	processed,
	order,
	scroll = false,
}: MetricChartProps) => {
	const { isLoading, metrics } = useMetrics({
		deviceId: sensor.device,
		sensorId: sensor.id,
		sensorType: sensor.type,
		metric: metricMeta.name,
		date: formatDate(date),
		processed,
		limit,
		order,
	});
	const formatMetricValue = (value: boolean | number) => {
		return metricMeta.isBoolean
			? value
				? "Yes"
				: "No"
			: (value as number).toFixed(2) + (metricMeta.unit || "");
	};

	if (isLoading) {
		return <Skeleton className="h-full w-full rounded" />;
	}
	if (!metrics || metrics.length === 0) {
		return (
			<div className="flex h-full flex-col items-center justify-center">
				<p className="text-default-500">No Data</p>
			</div>
		);
	}

	const data = metrics.map((metric) => ({
		...metric,
		formattedTime: formatTime(metric.time),
		formattedValue: formatMetricValue(metric.value),
	}));
	const Chart = metricMeta.isBoolean ? MetricBarChart : MetricLineChart;

	return (
		<div className={metricChart({ width: widthClass(scroll, metrics.length) })}>
			<Chart data={data} metricName={metricMeta.name} />
		</div>
	);
};

const widthClass = (scroll: boolean, metricsCount: number) => {
	if (!scroll) {
		return "full";
	}
	if (metricsCount < 10) {
		return "tiny";
	}
	if (metricsCount < 50) {
		return "md";
	}
	if (metricsCount < 100) {
		return "lg";
	}
	if (metricsCount < 200) {
		return "xl";
	}
	if (metricsCount < 400) {
		return "xxl";
	}
	if (metricsCount < 500) {
		return "huge";
	}
	return "max";
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
