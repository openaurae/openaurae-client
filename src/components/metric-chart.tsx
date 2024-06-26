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

import { Metric } from "@/hooks/use-metrics";

export interface FormattedMetric extends Metric {
  formattedValue: string;
  formattedTime: string;
}

export interface MetricChartProps {
  metricName: string;
  data: FormattedMetric[];
}

export function MetricBarChart({ metricName, data }: MetricChartProps) {
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
}

export function MetricLineChart({ metricName, data }: MetricChartProps) {
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
}

interface TooltipProps {
  formattedTime: string;
  formattedValue: string;
  metricName: string;
}

function ValueDetails({
  formattedTime,
  metricName,
  formattedValue,
}: TooltipProps) {
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
}
