import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export interface Device {
	id: string;
	name: string;
	latitude?: number;
	longitude?: number;
	last_record?: string;
	sensor_types?: string[];
}

export interface Sensor {
	id: string;
	device: string;
	name?: string;
	type: string;
	comments?: string;
	last_record?: Date;
	metrics: MetricMeta[];
}

export interface MetricMeta {
	name: string;
	displayName: string;
	unit?: string;
	isBoolean: boolean;
}
