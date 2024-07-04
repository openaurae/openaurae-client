import { MetricChart } from "@/components/metric-chart";
import { subtitle } from "@/components/primitives";
import { useDevice } from "@/hooks/user-device";
import type { MetricMeta, Sensor } from "@/types";
import { formatDate, parseDateValue } from "@/utils/datetime";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import type { DateValue } from "@internationalized/date";
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
		device && (
			<section>
				<h1 className={subtitle()}>Device {device.name || device.id}</h1>
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
							sensor.metrics.map((metricMeta) => (
								<SensorLatestMetrics
									key={`${sensor.id}-${metricMeta.name}`}
									metricMeta={metricMeta}
									sensor={sensor}
								/>
							)),
						)}
					</div>
				)}
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
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [datePickerValue, setDatePickerValue] = useState<DateValue | undefined>(
		parseDateValue(sensor?.last_record),
	);

	console.log(datePickerValue?.toString());

	return (
		<>
			<Card isPressable className="min-w-sm h-64" onPress={onOpen}>
				<CardHeader className="flex flex-col gap-2 px-4">
					<div className="flex w-full justify-between text-lg">
						<p>
							<span>{metricMeta.displayName}</span>
							{sensor.name && <span> ({sensor.name})</span>}
						</p>
						<span>{formatDate(sensor.last_record) || "NA"}</span>
					</div>
					<span className="self-start text-sm text-default-500">
						Latest records from sensor {sensor.id}.
					</span>
				</CardHeader>
				<CardBody className="h-full">
					{sensor.last_record ? (
						<MetricChart
							key={`${sensor.id}-${metricMeta.name}`}
							sensor={sensor}
							metricMeta={metricMeta}
							limit={metricMeta.isBoolean ? 10 : 15}
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
								value={metricMeta.displayName}
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
								<MetricChart
									sensor={sensor}
									metricMeta={metricMeta}
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

export default withAuthenticationRequired(DeviceDetailsPage);
