import { useTableSearchParams } from "@/components/device-table/search-params.ts";
import type { Device } from "@/types";
import { cn } from "@/utils";
import { Button } from "@nextui-org/button";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import type { Selection } from "@nextui-org/react";
import { ChevronDownIcon, Search } from "lucide-react";
import type React from "react";
import { useState } from "react";

export type SearchBarProps = React.ComponentProps<"div"> & {
	updateCriteria: (criteria: string) => void;
};

export function SearchBar({ className, updateCriteria }: SearchBarProps) {
	const { params } = useTableSearchParams();
	const [searchInput, setSearchInput] = useState<string>(params.q);

	return (
		<div className={cn("flex flex-row gap-4", className)}>
			<Input
				isClearable
				className="w-full sm:max-w-sm"
				placeholder="Search by id or name..."
				startContent={<Search size={20} />}
				value={searchInput}
				onClear={() => setSearchInput("")}
				onValueChange={setSearchInput}
			/>
			<Button variant="flat" onClick={() => updateCriteria(searchInput)}>
				Search
			</Button>
		</div>
	);
}

export type DeviceTypesFilterProps = {
	deviceTypes: Selection;
	updateDeviceTypes: (deviceTypes: Selection) => void;
};

export function DeviceTypesFilter({
	deviceTypes,
	updateDeviceTypes,
}: DeviceTypesFilterProps) {
	return (
		<Dropdown>
			<DropdownTrigger>
				<Button endContent={<ChevronDownIcon size={20} />} variant="flat">
					Device Types
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				disallowEmptySelection
				aria-label="Device Types Filter"
				closeOnSelect={false}
				selectedKeys={deviceTypes}
				selectionMode="multiple"
				onSelectionChange={updateDeviceTypes}
			>
				<DropdownItem key="air_quality">Air Quality</DropdownItem>
				<DropdownItem key="zigbee">Zigbee</DropdownItem>
				<DropdownItem key="nemo_cloud">Nemo Cloud</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}

export function searchIdOrName(devices: Device[], criteria: string): Device[] {
	if (!criteria) {
		return devices;
	}

	const target = criteria.toLowerCase();

	return devices.filter(
		({ id, name }) =>
			id.toLowerCase().includes(target) || name.toLowerCase().includes(target),
	);
}
