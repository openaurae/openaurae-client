import type { Sensor } from "@/types";

export function sensorIdentifier(sensor: Sensor) {
	let result = sensor.id;

	if (sensor.name) {
		result += ` (${sensor.name})`;
	}

	return result;
}
