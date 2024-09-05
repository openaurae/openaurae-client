import { BackButton } from "@/components/back";
import { MeasureChart } from "@/components/measure-chart";
import { subtitle } from "@/components/primitives";
import { useDevice } from "@/hooks/use-device";
import type { MeasureMetadata, Sensor } from "@/types";
import { formatDate, parseDateValue } from "@/utils/datetime";
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

const DeviceDetailsPage = () => {
	const { deviceId } = useParams();
	const { isLoading, device } = useDevice(deviceId ?? "");

	if (isLoading) {
		return <Spinner label="loading" size="lg" />;
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
				Click on cards to view all metrics of sensors
			</p>
			{sensors.length === 0 ? (
				<div className="text-lg w-full h-[60vh] flex justify-center items-center">
					No sensor
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
					{device.sensors.map((sensor) =>
						sensor.measureMetadata.map((metadata) => (
							<SensorLatestMetrics
								key={`${sensor.id}-${metadata.name}`}
								measureMetadata={metadata}
								sensor={sensor}
							/>
						)),
					)}
				</div>
			)}
		</section>
	);
};

const SensorLatestMetrics = ({
	sensor,
	measureMetadata,
}: {
	sensor: Sensor;
	measureMetadata: MeasureMetadata;
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
						<p>
							<span>{measureMetadata.name}</span>
							{sensor.name && <span> ({sensor.name})</span>}
						</p>
						<span>{formatDate(sensor.last_record) || "NA"}</span>
					</div>
					<div className="text-sm text-default-500 self-start">
						Sensor Id: {sensor.id}
					</div>
				</CardHeader>
				<CardBody className="h-full">
					{sensor.last_record ? (
						<MeasureChart
							key={`${sensor.id}-${measureMetadata.id}`}
							sensor={sensor}
							measureMetadata={measureMetadata}
							count={measureMetadata.is_bool ? 10 : 15}
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
							<Input
								readOnly
								size="sm"
								label="Metric"
								value={measureMetadata.name}
							/>
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
									measureMetadata={measureMetadata}
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
