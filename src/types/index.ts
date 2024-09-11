import type { SVGProps } from "react";
import type { Device } from "./device";
import type { Sensor } from "./sensor";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export { type Device, deviceSchema } from "./device";
export {
	type Sensor,
	type SensorType,
	sensorSchema,
	sensorTypeSchema,
} from "./sensor";

export interface MetricMetadata {
	name: string;
	display_name: string;
	unit?: string;
	is_bool: boolean;
}

export interface SensorWithMetadata extends Sensor {
	metricsMetadata: MetricMetadata[];
}

export interface DeviceWithSensors extends Device {
	sensors: SensorWithMetadata[];
}
