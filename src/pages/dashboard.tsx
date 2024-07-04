import { DevicesMap } from "@/components/device-map";
import { MetricChart } from "@/components/metric-chart";
import { subtitle } from "@/components/primitives";
import { useDevices } from "@/hooks/use-devices";
import { useDevice } from "@/hooks/user-device";
import type { Device, MetricMeta, Sensor } from "@/types";
import { parseDateValue } from "@/utils/datetime";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import type { DateValue } from "@internationalized/date";
import { Card, CardBody } from "@nextui-org/card";
import { DatePicker } from "@nextui-org/date-picker";
import { Select, SelectItem } from "@nextui-org/select";
import { Skeleton } from "@nextui-org/skeleton";
import { Switch } from "@nextui-org/switch";
import { useMemo, useState } from "react";

const DashboardPage = () => {
	const { isLoading, devices } = useDevices();
	const [selectedDevice, setSelectedDevice] = useState<Device | undefined>(
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

			<Card className={selectedDevice ? "h-[35vh]" : "h-[70vh]"}>
				<CardBody>
					{isLoading ? (
						<Skeleton className="h-full w-full" />
					) : (
						<DevicesMap
							// key={`device-map-${(!!selectedDeviceId)}`}
							devices={filtered}
							mapStyle="mapbox://styles/mapbox/light-v9"
							viewPort={{
								latitude: -37.909365,
								longitude: 145.134424,
								zoom: 10,
							}}
							height={selectedDevice ? "35vh" : "70vh"}
							selectedDevice={selectedDevice}
							setSelectedDevice={(device) => setSelectedDevice(device)}
						/>
					)}
				</CardBody>
			</Card>

			{/* set key to force re-render when selected device changes,
      otherwise values of select inputs will be cached across devices*/}
			{selectedDevice && (
				<DeviceCard key={selectedDevice.id} deviceId={selectedDevice.id} />
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

	const metricOptions = useMemo(() => {
		return sensor?.metrics || [];
	}, [sensor]);

	const metric = useMemo(() => {
		if (!metricOptions) {
			return undefined;
		}

		if (!selectedMetric && metricOptions.length === 1) {
			return metricOptions[0];
		}

		return metricOptions.filter((metric) => metric.name === selectedMetric)[0];
	}, [selectedMetric, metricOptions]);

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
							isDisabled={sensors.length === 0}
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
							selectedKeys={metric ? [metric.name] : []}
							onChange={(e) => setSelectedMetric(e.target.value)}
						>
							{(metric) => (
								<SelectItem key={metric.name}>{metric.displayName}</SelectItem>
							)}
						</Select>
						<DatePicker
							isDisabled={sensors.length === 0}
							label="Date"
							className="max-w-full"
							value={datePickerValue || parseDateValue(sensor?.last_record)}
							size="sm"
							onChange={setDatePickerValue}
						/>
					</div>
				</div>
				<Card className="min-w-sm h-64 w-full overflow-x-auto">
					<CardBody className="h-full w-full">
						{sensor && metric && datePickerValue ? (
							<SensorMetrics
								sensor={sensor}
								metricMeta={metric}
								date={datePickerValue.toString()}
								scroll={scroll}
							/>
						) : (
							<div className="flex h-full flex-col items-center justify-center">
								<p className="text-default-500 text-lg">
									Sensor metrics by date
								</p>
								{sensors.length === 0 && (
									<p className="text-default-500">Device has no sensors</p>
								)}
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
