import { z } from "zod";

export const sensorTypeSchema = z.enum([
	"ptqs1005",
	"pms5003st",
	"zigbee_temp",
	"zigbee_contact",
	"zigbee_power",
	"zigbee_occupancy",
	"zigbee_vibration",
	"nemo_cloud",
]);
export type SensorType = z.infer<typeof sensorTypeSchema>;

export const sensorSchema = z.object({
	device: z.string(),
	id: z.string(),
	type: sensorTypeSchema,
	name: z.string().optional(),
	comments: z.string().optional(),
	last_record: z.date().optional(),
});
export type Sensor = z.infer<typeof sensorSchema>;
