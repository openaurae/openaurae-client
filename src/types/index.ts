import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export { type Device, deviceSchema } from "./device";

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
