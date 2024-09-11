import { AddDeviceButton } from "@/components/device/add";
import { Loading } from "@/components/loading";
import { useDevices } from "@/hooks/use-devices";
import type { Device } from "@/types";
import { formatDateTime, timestamp } from "@/utils/datetime";
import { sortByNumericField, sortByStringField } from "@/utils/sort";
import type { Selection } from "@nextui-org/react";
import {
	type SortDescriptor,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/table";
import type React from "react";
import { useMemo, useState } from "react";
import { Actions } from "./actions";
import { columns } from "./columns";
import { DeviceTypesFilter, SearchBar, searchIdOrName } from "./filter";
import { PageSizeSelector, TablePagination } from "./pagination";
import { useTableSearchParams } from "./search-params";

export function DeviceTable() {
	const { params, updateParams } = useTableSearchParams();
	const [pageNum, setPageNum] = useState<number>(params.page);
	const [pageSize, setPageSize] = useState<number>(params.size);
	const [searchCriteria, setSearchCriteria] = useState<string>(params.q);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: params.orderBy,
		direction: params.order,
	});
	const [deviceTypes, setDeviceTypes] = useState<Selection>(
		params.types === "all" ? "all" : new Set(params.types.split(",")),
	);

	const { isLoading, devices } = useDevices();

	const allDevices = useMemo(() => devices || [], [devices]);

	const filteredDevices = useMemo(() => {
		const filtered = searchIdOrName(allDevices, searchCriteria);

		return deviceTypes === "all"
			? filtered
			: filtered.filter(({ type }) => deviceTypes.has(type));
	}, [allDevices, searchCriteria, deviceTypes]);

	const totalPages = useMemo(
		() => Math.ceil(filteredDevices.length / pageSize),
		[filteredDevices, pageSize],
	);

	const page = useMemo(() => {
		const start = (pageNum - 1) * pageSize;
		const end = start + pageSize;

		return sortByColumn(filteredDevices, sortDescriptor).slice(start, end);
	}, [filteredDevices, sortDescriptor, pageNum, pageSize]);

	const updatePageNum = (num: number) => {
		setPageNum(num);
		updateParams((prev) => ({
			...prev,
			page: num,
		}));
	};

	const updatePageSize = (newSize: number) => {
		setPageSize(newSize);
		setPageNum(1);
		updateParams((prev) => ({
			...prev,
			page: 1,
			size: newSize,
		}));
	};

	const updateSearchCriteria = (newCriteria: string) => {
		setSearchCriteria(newCriteria);
		setPageNum(1);
		updateParams((prev) => ({
			...prev,
			page: 1,
			size: pageSize,
			q: newCriteria,
		}));
	};

	const updateDeviceTypes = (deviceTypes: Selection) => {
		setDeviceTypes(deviceTypes);
		setPageNum(1);
		updateParams((prev) => ({
			...prev,
			page: 1,
			types: deviceTypes === "all" ? deviceTypes : [...deviceTypes].join(","),
		}));
	};

	const updateSortDescriptor = (newSortDescriptor: SortDescriptor) => {
		setSortDescriptor(newSortDescriptor);
		setPageNum(1);
		updateParams((prev) => ({
			...prev,
			page: 1,
			orderBy: newSortDescriptor.column?.toString() || "last_record",
			order: newSortDescriptor.direction || "descending",
		}));
	};

	const topContent = (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
				<SearchBar updateCriteria={updateSearchCriteria} />
				<div className="flex gap-4">
					<AddDeviceButton />
					<DeviceTypesFilter
						deviceTypes={deviceTypes}
						updateDeviceTypes={updateDeviceTypes}
					/>
				</div>
			</div>
			<div className="flex items-center justify-between">
				<span className="text-small text-default-400">
					Total {allDevices.length} devices
				</span>
				<PageSizeSelector updatePageSize={updatePageSize} />
			</div>
		</div>
	);

	return (
		<Table
			aria-label="table of air quality (AQ) and zigbee (ZG) devices"
			bottomContent={
				devices && (
					<TablePagination
						page={pageNum}
						total={totalPages}
						onChange={updatePageNum}
					/>
				)
			}
			bottomContentPlacement="outside"
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSortChange={updateSortDescriptor}
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
				items={page}
				isLoading={isLoading}
				loadingContent={<Loading />}
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
}

function renderCell(device: Device, columnKey: React.Key) {
	switch (columnKey) {
		case "id":
			return <p className="w-full text-center">{device.id}</p>;
		case "name":
			return <p className="w-full text-center">{device.name}</p>;
		case "room":
			return <p className="w-full text-center">{device.room}</p>;
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
}

function sortByColumn(
	devices: Device[],
	{ column, direction }: SortDescriptor,
): Device[] {
	const desc = direction === "descending";

	switch (column) {
		case "id":
		case "name":
		case "room":
			return sortByStringField(devices, (item) => item[column] || "", desc);
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
}
