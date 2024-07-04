import type { Device } from "@/types";
import { formatDateTime } from "@/utils/datetime";
import clsx from "clsx";
import type React from "react";
import { useState } from "react";
import { Marker, Popup, Map as ReactMap, type ViewState } from "react-map-gl";

export interface DevicesMapProps {
	mapStyle: string;
	viewPort: {
		longitude: number;
		latitude: number;
		zoom: number;
	};
	devices: Device[];
	selectedDevice?: Device;
	setSelectedDevice: (device: Device) => void;
	height?: string | number;
}

export const DevicesMap = ({
	devices,
	viewPort,
	mapStyle,
	setSelectedDevice,
	selectedDevice,
	height,
}: DevicesMapProps) => {
	const [viewState, setViewState] =
		useState<Pick<ViewState, "longitude" | "latitude" | "zoom">>(viewPort);
	const [hoveredDevice, setHoveredDevice] = useState<Device | undefined>(
		undefined,
	);

	return (
		<ReactMap
			key={height}
			{...viewState}
			mapboxAccessToken="pk.eyJ1IjoibW9uYXNoYXVyYWUiLCJhIjoiY2pyMGJqbzV2MDk3dTQ0bndqaHA4d3hzeSJ9.TDvqYvsmY1DHhE8N8_UbFg"
			style={{ width: "100%", height }}
			mapStyle={mapStyle}
			onMove={(e) => setViewState(e.viewState)}
			onZoom={(e) => setViewState(e.viewState)}
		>
			{hoveredDevice && <DevicePopup device={hoveredDevice} />}
			{devices
				.filter((device) => device.longitude && device.latitude)
				.map((device) => (
					<Marker
						style={{ cursor: "pointer" }}
						key={device.id}
						longitude={device.longitude ?? 0}
						latitude={device.latitude ?? 0}
						onClick={() => {
							setSelectedDevice(device);
							setViewState({
								...viewState,
								latitude: device.latitude ?? 0,
								longitude: device.longitude ?? 0,
							});
						}}
					>
						<Pin
							hovered={selectedDevice?.id === device.id}
							onMouseEnter={() => {
								setHoveredDevice(device);
							}}
							onMouseLeave={() => {
								setHoveredDevice(undefined);
							}}
						/>
					</Marker>
				))}
		</ReactMap>
	);
};

const DevicePopup = ({ device }: { device?: Device }) => {
	if (!device || !device.latitude || !device.longitude) {
		return null;
	}

	const { name, latitude, longitude, last_record } = device;

	return (
		<Popup
			anchor="bottom"
			closeButton={false}
			latitude={latitude}
			longitude={longitude}
		>
			<div className="rounded-lg m-2 grid grid-cols-2">
				<div className="flex flex-col">
					<span className="text-default-500 uppercase">Name</span>
					<span className="text-foreground font-bold">{name}</span>
				</div>
				<div className="flex flex-col">
					<span className="text-default-500 uppercase">Last Record</span>
					<span className="text-foreground font-bold">
						{formatDateTime(last_record)}
					</span>
				</div>
			</div>
		</Popup>
	);
};

const Pin = ({
	className,
	hovered,
	...props
}: React.ComponentProps<"div"> & { hovered: boolean }) => {
	return (
		<div
			{...props}
			className={clsx(
				"h-4 w-4 rounded-full",
				hovered ? "bg-sky-500" : "bg-[#516b91]",
				className,
			)}
		/>
	);
};
