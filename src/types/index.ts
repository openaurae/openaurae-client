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
	measureMetadata: MeasureMetadata[];
}

export interface MeasureMetadata {
	id: string;
	name: string;
	unit?: string;
	is_bool: boolean;
}
