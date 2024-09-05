import { z } from "zod";

export const deviceSchema = z.object({
	id: z
		.string()
		.min(1, {
			message: "device id cannot be empty",
		})
		.max(50, {
			message: "device id cannot have more than 50 characters",
		})
		.regex(/^[\w:]{1,50}$/, {
			message: "device id should contain only letters, digits and semicolons",
		}),
	name: z
		.string()
		.min(1, {
			message: "device name cannot be empty",
		})
		.max(50, {
			message: "device name cannot have more than 50 characters",
		}),
	device_type: z.enum(["nemo_cloud", "air_quality", "zigbee"]),
	latitude: z.coerce
		.number({
			message: "latitude must be a number",
		})
		.lte(90, {
			message: "latitude must <= 90",
		})
		.gte(-90, {
			message: "latitude must >= -90",
		})
		.optional(),
	longitude: z.coerce
		.number({
			message: "longitude must be a number",
		})
		.lte(180, {
			message: "longitude must <= 180",
		})
		.gte(-180, {
			message: "longitude must >= -180",
		})
		.optional(),
	room: z.string().optional(),
	last_record: z.string().datetime().optional(),
	sensor_types: z.string().array().optional(),
});

export type Device = z.infer<typeof deviceSchema>;
