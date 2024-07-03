import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/modal";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import {
	type SortDescriptor,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/table";

import { Tooltip } from "@nextui-org/tooltip";
import clsx from "clsx";
import { Download, Eye, Search } from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

import { AddDeviceButton } from "@/components/add-device";
import { DeleteDeviceButton } from "@/components/delete-device.tsx";
import { UpdateDeviceButton } from "@/components/update-device";
import { useDevices } from "@/hooks/use-devices";
import { useAuth0User } from "@/hooks/use-user.ts";
import type { Device } from "@/types";
import { formatDate, formatDateTime, timestamp } from "@/utils/datetime";
import { sortByNumericField, sortByStringField } from "@/utils/sort";
import { parseDate } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { DateRangePicker } from "@nextui-org/date-picker";
import type { DateValue } from "@react-types/datepicker";
import type { RangeValue } from "@react-types/shared";

const columns = [
	{
		key: "id",
		label: "ID",
		allowsSorting: true,
	},
	{
		key: "name",
		label: "NAME",
		allowsSorting: true,
	},
	{
		key: "latitude",
		label: "LATITUDE",
		allowsSorting: true,
	},
	{
		key: "longitude",
		label: "LONGITUDE",
		allowsSorting: true,
	},
	{
		key: "last_record",
		label: "LAST RECORD",
		allowsSorting: true,
	},
	{
		key: "actions",
		label: "ACTIONS",
		allowsSorting: false,
	},
];

const DeviceTable = () => {
	const { isLoading, devices } = useDevices();
	const [searchValue, setSearchValue] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "last_record",
		direction: "descending",
	});

	const n = devices?.length || 0;
	const pages = Math.ceil(n / rowsPerPage);

	const filteredDevices = useMemo(() => {
		let result = devices || [];

		if (searchValue) {
			result = result.filter((device) => device.id.includes(searchValue));
		}

		return result;
	}, [searchValue, devices]);

	const sortedDevices = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return sortByColumn(filteredDevices, sortDescriptor).slice(start, end);
	}, [filteredDevices, sortDescriptor, page, rowsPerPage]);

	const onRowsPerPageChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setRowsPerPage(Number(e.target.value));
			setPage(1);
		},
		[],
	);

	const onSearchChange = useCallback((value?: string) => {
		setSearchValue(value || "");
		setPage(1);
	}, []);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center gap-2">
					<Input
						isClearable
						className="w-full sm:max-w-sm"
						placeholder="Search by id..."
						startContent={<Search size={20} />}
						value={searchValue}
						onClear={() => setSearchValue("")}
						onValueChange={onSearchChange}
					/>
					<AddDeviceButton />
				</div>
				<div className="flex items-center justify-between">
					<span className="text-small text-default-400">Total {n} devices</span>
					<label className="flex items-center text-small text-default-400">
						Rows per page:
						<select
							className="bg-transparent text-small text-default-400 outline-none"
							onChange={onRowsPerPageChange}
						>
							<option selected value="10">
								10
							</option>
							<option value="20">20</option>
							<option value="50">50</option>
						</select>
					</label>
				</div>
			</div>
		);
	}, [n, onRowsPerPageChange, onSearchChange, searchValue]);

	const bottomContent = useMemo(() => {
		return (
			<div className="flex items-center justify-center">
				<Pagination
					isCompact
					showControls
					showShadow
					color="primary"
					page={page}
					total={pages}
					onChange={setPage}
				/>
			</div>
		);
	}, [page, pages]);

	const renderCell = useCallback((device: Device, columnKey: React.Key) => {
		switch (columnKey) {
			case "id":
				return <p className="w-full text-center">{device.id}</p>;
			case "name":
				return <p className="w-full text-center">{device.name}</p>;
			case "longitude":
				return (
					<p className="w-full text-center">{device.longitude?.toFixed(6)}</p>
				);
			case "latitude":
				return (
					<p className="w-full text-center">{device.latitude?.toFixed(6)}</p>
				);
			case "last_record":
				return (
					<p className="w-full text-center">
						{formatDateTime(device.last_record)}
					</p>
				);
			case "actions":
				return <Actions className="px-6" device={device} />;
		}
	}, []);

	return (
		<Table
			isHeaderSticky
			isStriped
			aria-label="Device table"
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSortChange={setSortDescriptor}
		>
			<TableHeader columns={columns}>
				{({ key, allowsSorting, label }) => (
					<TableColumn
						key={key}
						align="center"
						allowsSorting={allowsSorting}
						className="text-center"
					>
						{label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				isLoading={isLoading}
				items={sortedDevices}
				loadingContent={<Spinner label="Loading..." />}
			>
				{(device) => (
					<TableRow key={device.id}>
						{(columnKey) => (
							<TableCell className="md:px-6">
								{renderCell(device, columnKey)}
							</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

const ExportRecordsButton = ({ device }: { device: Device }) => {
	const { accessToken } = useAuth0User();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [value, setValue] = useState<RangeValue<DateValue>>({
		start: parseDate(formatDate(device.last_record || new Date())),
		end: parseDate(formatDate(device.last_record || new Date())),
	});

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
									value={value}
									onChange={setValue}
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
								<Link
									href={`${import.meta.env.VITE_API_BASE_URL}/export/csv/readings?accessToken=${accessToken}&deviceId=${device.id}&start=${value.start.toString()}&end=${value.end.toString()}`}
								>
									<Button color="primary" onPress={onClose}>
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
};

const Actions = ({
	device,
	className,
}: React.ComponentProps<"div"> & { device: Device }) => {
	return (
		<div
			className={clsx(
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
};

const sortByColumn = (
	devices: Device[],
	{ column, direction }: SortDescriptor,
): Device[] => {
	const desc = direction === "descending";

	switch (column) {
		case "id":
		case "name":
			return sortByStringField(devices, (item) => item[column], desc);
		case "longitude":
		case "latitude":
			return sortByNumericField(devices, (item) => item[column], desc);
		case "last_record":
			return sortByNumericField(
				devices,
				(item) => timestamp(item.last_record),
				desc,
			);
		default:
			throw new Error(`Unsupported device sorting criteria: ${column}`);
	}
};

export default DeviceTable;
