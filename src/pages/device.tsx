import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { Spinner } from "@nextui-org/spinner";
import { useParams } from "react-router-dom";

import { MetricBarChart, MetricLineChart } from "@/components/metric-chart";
import { subtitle } from "@/components/primitives";
import { useMetrics } from "@/hooks/use-metrics";
import { useDevice } from "@/hooks/user-device";
import { MetricMeta, Sensor } from "@/types";
import { formatDate, formatTime } from "@/utils/datetime";

const DeviceDetailsPage = ({}) => {
  const { deviceId } = useParams();
  const { isLoading, device } = useDevice(deviceId!);

  if (isLoading) {
    return <Spinner label="loading" size="lg" />;
  }

  return (
    device && (
      <section>
        <h1 className={subtitle()}>Device {device.name || device.id}</h1>
        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {device.sensors.map((sensor) =>
            sensor.metrics.map((metricMeta) => (
              <SensorLatestMetrics
                key={`${sensor.id}-${metricMeta.name}`}
                metricMeta={metricMeta}
                sensor={sensor}
              />
            )),
          )}
        </div>
      </section>
    )
  );
};

const SensorLatestMetrics = ({
  sensor,
  metricMeta,
}: {
  sensor: Sensor;
  metricMeta: MetricMeta;
}) => {
  const { isLoading, metrics } = useMetrics({
    deviceId: sensor.device,
    sensorId: sensor.id,
    sensorType: sensor.type,
    metric: metricMeta.name,
    date: sensor.last_record!,
    processed: true,
    limit: metricMeta.isBoolean ? 10 : 20,
  });

  const formatMetricValue = (value: boolean | number) => {
    return metricMeta.isBoolean
      ? value
        ? "Yes"
        : "No"
      : (value as number).toFixed(2) + (metricMeta.unit || "");
  };

  const renderBody = () => {
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

    return <Chart data={data} metricName={metricMeta.name} />;
  };

  return (
    <Card isPressable className="min-w-sm h-64" onPress={() => {}}>
      <CardHeader className="flex flex-col gap-2 px-4">
        <div className="flex w-full justify-between text-lg">
          <span>{metricMeta.displayName}</span>
          <span>{formatDate(sensor.last_record) || "NA"}</span>
        </div>
        <span className="self-start text-sm text-default-500">
          Latest records from sensor {sensor.id}.
        </span>
      </CardHeader>
      <CardBody className="h-full">{renderBody()}</CardBody>
    </Card>
  );
};

export default withAuthenticationRequired(DeviceDetailsPage);
