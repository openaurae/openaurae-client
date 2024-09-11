import { BackButton } from "@/components/back";
import { MeasureChart } from "@/components/measure-chart";
import { subtitle } from "@/components/primitives";
import { useDevice } from "@/hooks/use-device";
import type { MetricMetadata, Sensor, SensorWithMetadata } from "@/types";
import { formatDate, formatDateTime, parseDateValue } from "@/utils/datetime";
import type { DateValue } from "@internationalized/date";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/breadcrumbs";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/input";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";
import { useState } from "react";
import { useParams } from "react-router-dom";

// TODO: DeviceLayout
function DeviceDetailsPage() {
	const { deviceId } = useParams();
	const { isLoading, device } = useDevice(deviceId ?? "");

	if (isLoading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<Spinner label="Loading..." size="lg" aria-label="Loading Device" />
			</div>
		);
	}

	if (!device) {
		return <section>Device Not Found</section>;
	}

	const sensors = device.sensors;

	return (
		<section>
			<Breadcrumbs>
				<BreadcrumbItem href="/devices">Devices</BreadcrumbItem>
				<BreadcrumbItem>{device.id}</BreadcrumbItem>
			</Breadcrumbs>

			<div className="flex flex-row gap-4 items-center py-4">
				<BackButton />
				<h1 className={subtitle()}>Device {device.name || device.id}</h1>
			</div>
			<p className="text-default-500 text-sm">
				Click on cards to view full sensor metric readings.
			</p>
			{sensors.length === 0 ? (
				<div className="text-lg w-full h-[60vh] flex justify-center items-center">
					No sensor
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 py-4 md:gap-6">
					{/* TODO: select sensor and metric instead of showing all sensor metrics */}
					{device.sensors.map((sensor) => (
						<SensorDetails key={sensor.id} sensor={sensor} />
					))}
				</div>
			)}
		</section>
	);
}

function SensorDetails({ sensor }: { sensor: SensorWithMetadata }) {
	return (
		<div className="min-h-[300px]">
			<div className="flex flex-row items-center justify-between py-4">
				<h1 className="text-lg">
					Sensor {sensor.id} {sensor.name && `(${sensor.name})`}
				</h1>
				<p>Last Record: {formatDateTime(sensor.last_record) || "NA"}</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3">
				{sensor.metricsMetadata ? (
					sensor.metricsMetadata.map((metricMeta) => (
						<SensorLatestMetrics
							key={metricMeta.name}
							sensor={sensor}
							metadata={metricMeta}
						/>
					))
				) : (
					<div>No Metric</div>
				)}
			</div>
		</div>
	);
}

const SensorLatestMetrics = ({
	sensor,
	metadata,
}: {
	sensor: Sensor;
	metadata: MetricMetadata;
}) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [datePickerValue, setDatePickerValue] = useState<DateValue | undefined>(
		parseDateValue(sensor?.last_record),
	);

	return (
		<>
			<Card isPressable className="min-w-sm h-64" onPress={onOpen}>
				<CardHeader className="flex flex-col gap-2 px-4">
					<div className="flex w-full justify-between text-lg">
						<p>{metadata.name}</p>
						<span>{formatDate(sensor.last_record) || "NA"}</span>
					</div>
					<div className="text-sm text-default-500 self-start">
						Sensor Id: {sensor.id}
					</div>
				</CardHeader>
				<CardBody className="h-full">
					{sensor.last_record ? (
						<MeasureChart
							key={`${sensor.id}-${metadata.name}`}
							sensor={sensor}
							metricMetadata={metadata}
							count={metadata.is_bool ? 10 : 15}
							processed={true}
							date={sensor.last_record}
							order="desc"
						/>
					) : (
						<div className="flex h-full flex-col items-center justify-center">
							<p className="text-default-500">No Data</p>
						</div>
					)}
				</CardBody>
			</Card>

			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				backdrop="blur"
				size="5xl"
			>
				<ModalContent>
					<ModalHeader>{sensor.name || sensor.id}</ModalHeader>
					<ModalBody className="gap-6">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 justify-end">
							<Input readOnly size="sm" label="Sensor Id" value={sensor.id} />
							<Input readOnly size="sm" label="Metric" value={metadata.name} />
							<DatePicker
								label="Date"
								className="w-full lg:max-w-1/2"
								size="sm"
								value={datePickerValue}
								onChange={setDatePickerValue}
							/>
						</div>
						{datePickerValue ? (
							<div className="min-w-sm h-64 w-full overflow-x-auto">
								<MeasureChart
									sensor={sensor}
									metricMetadata={metadata}
									processed={true}
									date={datePickerValue?.toString()}
									scroll={true}
									order="asc"
								/>
							</div>
						) : (
							<div>Sensor metrics by date</div>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeviceDetailsPage;
