import { sensorIdentifier } from "@/components/sensor/helper.ts";
import type { DeviceWithSensors, Sensor } from "@/types";
import { Select, SelectItem, type Selection } from "@nextui-org/react";
import { useState } from "react";

export interface SensorSelectorProps {
	device: DeviceWithSensors;
	onSensorChange: (sensor: Sensor | null) => void;
}

export function SensorSelector({
	device,
	onSensorChange,
}: SensorSelectorProps) {
	const [value, setValue] = useState<Selection>(new Set([]));

	return (
		<Select
			label="Sensor Id"
			variant="bordered"
			className="max-w-xs"
			selectionMode="single"
			size="sm"
			onSelectionChange={(keys) => {
				setValue(keys);
				onSensorChange(selectedSensor(device, keys));
			}}
			selectedKeys={value}
		>
			{device.sensors.map((sensor) => (
				<SelectItem key={sensor.id}>{sensorIdentifier(sensor)}</SelectItem>
			))}
		</Select>
	);
}

function selectedSensor(
	device: DeviceWithSensors,
	selection: Selection,
): Sensor | null {
	if (selection === "all" || selection.size > 1) {
		throw Error("should not support multiple selection");
	}

	if (selection.size === 0) {
		return null;
	}

	const sensorId = selection.keys().next().value.toString();

	const [sensor] = device.sensors.filter((sensor) => sensor.id === sensorId);

	return sensor;
}
