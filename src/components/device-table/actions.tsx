import { DeleteDeviceButton } from "@/components/device/delete.tsx";
import { ExportRecordsButton } from "@/components/device/export.tsx";
import { UpdateDeviceButton } from "@/components/device/update.tsx";
import type { Device } from "@/types";
import { cn } from "@/utils";
import { Link } from "@nextui-org/link";
import { Tooltip } from "@nextui-org/tooltip";
import { Eye } from "lucide-react";
import type React from "react";

export function Actions({
	device,
	className,
}: React.ComponentProps<"div"> & { device: Device }) {
	return (
		<div
			className={cn(
				"relative flex items-center justify-center gap-3 py-1",
				className,
			)}
		>
			<Tooltip content="View Details">
				<Link
					className="text-lg text-default-400"
					as="a"
					href={`/devices/${device.id}`}
				>
					<Eye size={20} />
				</Link>
			</Tooltip>

			<UpdateDeviceButton device={device} />

			<ExportRecordsButton device={device} />

			<DeleteDeviceButton device={device} />
		</div>
	);
}
