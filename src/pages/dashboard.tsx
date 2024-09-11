import { DevicesMap } from "@/components/device-map";
import { MeasureChart } from "@/components/measure-chart";
import { subtitle } from "@/components/primitives";
import { useDevice } from "@/hooks/use-device.ts";
import { useDevices } from "@/hooks/use-devices";
import type { Device, MetricMetadata, Sensor } from "@/types";
import { parseDateValue } from "@/utils/datetime";
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
	const [scroll, setScroll] = useState<boolean>(false);
	const [datePickerValue, setDatePickerValue] = useState<DateValue | undefined>(
		undefined,
	);
	const [selectedSensorId, setSelectedSensorId] = useState<string | undefined>(
		undefined,
	);
	const [selectedMeasure, setSelectedMeasure] = useState<string | undefined>(
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

	const measureOptions = useMemo(() => {
		return sensor?.metricsMetadata || [];
	}, [sensor]);

	const measureMetadata = useMemo(() => {
		if (!measureOptions) {
			return undefined;
		}

		if (!selectedMeasure && measureOptions.length === 1) {
			return measureOptions[0];
		}

		return measureOptions.filter(
			(metadata) => metadata.name === selectedMeasure,
		)[0];
	}, [selectedMeasure, measureOptions]);

	const lastRecord = useMemo(() => {
		if (datePickerValue) {
			return datePickerValue;
		}

		if (!sensor || !sensor.last_record) {
			return undefined;
		}

		return parseDateValue(sensor.last_record);
	}, [sensor, datePickerValue]);

	console.log(lastRecord);

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
											{sensor.metricsMetadata
												.map((metric) => metric.display_name)
												.join(", ")}
										</span>
									</div>
								</SelectItem>
							)}
						</Select>
						<Select
							items={measureOptions}
							isDisabled={measureOptions.length === 0}
							size="sm"
							label="Metric"
							placeholder="Select Metric"
							className="min-w-20"
							selectedKeys={measureMetadata ? [measureMetadata.name] : []}
							onChange={(e) => setSelectedMeasure(e.target.value)}
						>
							{({ name, display_name }) => (
								<SelectItem key={name}>{display_name}</SelectItem>
							)}
						</Select>
						<DatePicker
							isDisabled={sensors.length === 0}
							label="Date"
							className="max-w-full"
							value={lastRecord}
							size="sm"
							onChange={setDatePickerValue}
						/>
					</div>
				</div>
				<Card className="min-w-sm h-64 w-full overflow-x-auto">
					<CardBody className="h-full w-full">
						{sensor && measureMetadata && lastRecord ? (
							<SensorMeasures
								sensor={sensor}
								measureMetadata={measureMetadata}
								date={lastRecord.toString()}
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

const SensorMeasures = ({
	sensor,
	measureMetadata,
	date,
	scroll,
}: {
	sensor: Sensor;
	measureMetadata: MetricMetadata;
	date: string | Date;
	scroll: boolean;
}) => {
	return (
		<MeasureChart
			key={`${sensor.id}-${measureMetadata.name}`}
			sensor={sensor}
			metricMetadata={measureMetadata}
			processed={true}
			date={date}
			order="asc"
			scroll={scroll}
			dot={scroll}
		/>
	);
};

export default DashboardPage;
