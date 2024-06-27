import { DevicesMap } from "@/components/device-map";
import { MetricChart } from "@/components/metric-chart";
import { subtitle } from "@/components/primitives";
import { useDevices } from "@/hooks/use-devices";
import { useDevice } from "@/hooks/user-device";
import { MetricMeta, Sensor } from "@/types";
import { parseDateValue } from "@/utils/datetime";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { DateValue } from "@internationalized/date";
import { Card, CardBody } from "@nextui-org/card";
import { DatePicker } from "@nextui-org/date-picker";
import { Select, SelectItem } from "@nextui-org/select";
import { Skeleton } from "@nextui-org/skeleton";
import { Switch } from "@nextui-org/switch";
import { useMemo, useState } from "react";

const DashboardPage = () => {
  const { isLoading, devices } = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
    undefined,
  );

  const total = devices?.length || 0;
  const filtered = (devices || []).filter(
    (device) => device.last_record && device.latitude && device.longitude,
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="md:px-2">
        <h1 className={subtitle()}>Live Sensor Metrics</h1>
        <div className="flex justify-between text-sm text-default-500">
          <span> Click on pins to view sensor metrics.</span>
          <span>
            {filtered.length}/{total} displayed
          </span>
        </div>
      </div>

      <Card className="h-[60vh]">
        <CardBody>
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <DevicesMap
              devices={filtered}
              mapStyle="mapbox://styles/mapbox/light-v9"
              viewPort={{
                latitude: -37.909365,
                longitude: 145.134424,
                zoom: 10,
              }}
              onDeviceSelected={(device) => setSelectedDeviceId(device.id)}
            />
          )}
        </CardBody>
      </Card>

      {/* set key to force re-render when selected device changes,
      otherwise values of select inputs will be cached across devices*/}
      {selectedDeviceId && (
        <DeviceCard key={selectedDeviceId} deviceId={selectedDeviceId} />
      )}
    </section>
  );
};

const DeviceCard = ({ deviceId }: { deviceId: string }) => {
  const { device } = useDevice(deviceId);
  const [scroll, setScroll] = useState<boolean>(true);
  const [datePickerValue, setDatePickerValue] = useState<DateValue | undefined>(
    undefined,
  );
  const [selectedSensorId, setSelectedSensorId] = useState<string | undefined>(
    undefined,
  );
  const [selectedMetric, setSelectedMetric] = useState<string | undefined>(
    undefined,
  );

  const sensors = useMemo(() => {
    return device?.sensors || [];
  }, [device]);

  const sensor = useMemo(() => {
    return device && selectedSensorId
      ? device.sensors.filter((sensor) => sensor.id === selectedSensorId)[0]
      : undefined;
  }, [device, selectedSensorId]);

  const date = useMemo(() => {
    return datePickerValue
      ? datePickerValue
      : parseDateValue(sensor?.last_record);
  }, [datePickerValue, sensor]);

  const metricOptions = useMemo(() => {
    return sensor?.metrics || [];
  }, [device, sensor]);

  const metric = useMemo(() => {
    return selectedMetric && metricOptions
      ? metricOptions.filter((metric) => metric.name === selectedMetric)[0]
      : undefined;
  }, [device, selectedSensorId, selectedMetric]);

  return (
    device && (
      <>
        <div className="flex flex-col items-center justify-between gap-2 md:px-2 lg:flex-row">
          <div className="flex w-full items-center justify-between gap-2 lg:w-1/3 lg:justify-start">
            <span className={subtitle({ class: "max-w-40", fullWidth: false })}>
              {device.name}
            </span>
            <Switch size="md" isSelected={scroll} onValueChange={setScroll}>
              Scroll
            </Switch>
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-1/2 lg:flex-row">
            <Select
              items={sensors}
              size="sm"
              label="Sensor"
              placeholder="Select Sensor"
              className="min-w-52"
              onChange={(e) => setSelectedSensorId(e.target.value)}
            >
              {(sensor) => (
                <SelectItem key={sensor.id} textValue={sensor.id}>
                  <div className="flex flex-col">
                    <span>{sensor.id}</span>
                    <span className="text-tiny text-default-500">
                      {sensor.metrics
                        .map((metric) => metric.displayName)
                        .join(", ")}
                    </span>
                  </div>
                </SelectItem>
              )}
            </Select>
            <Select
              items={metricOptions}
              isDisabled={metricOptions.length === 0}
              size="sm"
              label="Metric"
              placeholder="Select Metric"
              className="min-w-20"
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {(metric) => (
                <SelectItem key={metric.name}>{metric.displayName}</SelectItem>
              )}
            </Select>
            <DatePicker
              label="Date"
              className="max-w-full"
              value={date}
              size="sm"
              onChange={setDatePickerValue}
            />
          </div>
        </div>
        <Card className="min-w-sm h-64 w-full overflow-x-auto">
          <CardBody className="h-full w-full">
            {sensor && metric && date ? (
              <SensorMetrics
                sensor={sensor}
                metricMeta={metric}
                date={date.toString()}
                scroll={scroll}
              />
            ) : (
              <div className="flex h-full flex-row items-center justify-center">
                <span className="text-default-500">Sensor metrics by date</span>
              </div>
            )}
          </CardBody>
        </Card>
      </>
    )
  );
};

const SensorMetrics = ({
  sensor,
  metricMeta,
  date,
  scroll,
}: {
  sensor: Sensor;
  metricMeta: MetricMeta;
  date: string | Date;
  scroll: boolean;
}) => {
  return (
    <MetricChart
      key={`${sensor.id}-${metricMeta.name}`}
      sensor={sensor}
      metricMeta={metricMeta}
      processed={true}
      date={date}
      order="asc"
      scroll={scroll}
    />
  );
};

export default withAuthenticationRequired(DashboardPage);
