import { useAuth0User } from "@/hooks/use-user.ts";
import type { Device } from "@/types";
import { formatDate } from "@/utils/datetime.ts";
import { parseDate } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { DateRangePicker } from "@nextui-org/date-picker";
import { Link } from "@nextui-org/link";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/modal";
import { Tooltip } from "@nextui-org/tooltip";
import type { DateValue } from "@react-types/datepicker";
import type { RangeValue } from "@react-types/shared";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";

export function ExportRecordsButton({ device }: { device: Device }) {
	const { accessToken } = useAuth0User();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
		start: parseDate(formatDate(device.last_record || new Date())),
		end: parseDate(formatDate(device.last_record || new Date())),
	});

	const url = useMemo(() => {
		const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
		const start = dateRange.start.toString();
		const end = dateRange.end.toString();
		return `${baseUrl}/devices/${device.id}/readings/csv?accessToken=${accessToken}&start=${start}&end=${end}`;
	}, [accessToken, dateRange, device.id]);

	return (
		<>
			<Tooltip content="Export Sensor Records">
				<Link className="text-lg text-default-400" as="button" onPress={onOpen}>
					<Download size={20} />
				</Link>
			</Tooltip>

			<Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<div>
							<ModalHeader>Download Device Records</ModalHeader>
							<ModalBody>
								<DateRangePicker
									className="max-w-xs"
									label="Date Range"
									value={dateRange}
									onChange={setDateRange}
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									isDisabled={!accessToken}
									variant="flat"
									onPress={onClose}
								>
									Close
								</Button>
								<Link download={true} href={url}>
									<Button
										color="primary"
										onPress={onClose}
										isDisabled={!accessToken}
									>
										Download
									</Button>
								</Link>
							</ModalFooter>
						</div>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
