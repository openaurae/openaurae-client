import { MetricChart } from "@/components/metric-chart";
import { subtitle } from "@/components/primitives";
import { useDevice } from "@/hooks/user-device";
import { MetricMeta, Sensor } from "@/types";
import { formatDate } from "@/utils/datetime";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { useParams } from "react-router-dom";

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
      <CardBody className="h-full">
        <MetricChart
          key={`${sensor.id}-${metricMeta.name}`}
          sensor={sensor}
          metricMeta={metricMeta}
          limit={metricMeta.isBoolean ? 10 : 15}
          processed={true}
          date={sensor.last_record!}
          sort="desc"
        />
      </CardBody>
    </Card>
  );
};

export default withAuthenticationRequired(DeviceDetailsPage);
