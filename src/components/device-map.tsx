import type { Device } from "@/types";
import { formatDateTime } from "@/utils/datetime";
import mapboxgl, { type Popup } from "mapbox-gl";
import { useState } from "react";
import { Marker, Map as ReactMap, type ViewState } from "react-map-gl";

export interface DevicesMapProps {
	mapStyle: string;
	viewPort: {
		longitude: number;
		latitude: number;
		zoom: number;
	};
	devices: Device[];
	onDeviceSelected: (device: Device) => void;
}

export const DevicesMap = ({
	devices,
	viewPort,
	mapStyle,
	onDeviceSelected,
}: DevicesMapProps) => {
	const [viewState, setViewState] =
		useState<Pick<ViewState, "longitude" | "latitude" | "zoom">>(viewPort);

	return (
		<ReactMap
			{...viewState}
			mapboxAccessToken="pk.eyJ1IjoibW9uYXNoYXVyYWUiLCJhIjoiY2pyMGJqbzV2MDk3dTQ0bndqaHA4d3hzeSJ9.TDvqYvsmY1DHhE8N8_UbFg"
			style={{ width: "100%", height: "100.5%" }}
			mapStyle={mapStyle}
			onMove={(e) => setViewState(e.viewState)}
			onZoom={(e) => setViewState(e.viewState)}
		>
			{devices
				.filter((device) => device.longitude && device.latitude)
				.map((device) => (
					<Marker
						key={device.id}
						longitude={device.longitude ?? 0}
						latitude={device.latitude ?? 0}
						color="red"
						popup={buildPopup(device)}
						onClick={() => onDeviceSelected(device)}
					>
						<Pin />
					</Marker>
				))}
		</ReactMap>
	);
};

const buildPopup = ({
	name,
	latitude,
	longitude,
	last_record,
}: Device): Popup => {
	const html = `
<div class="rounded-lg m-2 grid grid-cols-2">
  <div class="flex flex-col">
    <span class="text-default-500 uppercase">Name</span>
    <span class="text-foreground font-bold">${name}</span>
  </div>
  <div class="flex flex-col">
    <span class="text-default-500 uppercase">Last Record</span>
    <span class="text-foreground font-bold">${formatDateTime(last_record)}</span>
  </div>
</div>`;

	if (!latitude || !longitude) {
		throw new Error("latitude and longitude required");
	}

	return new mapboxgl.Popup({
		className: "text-default",
	})
		.setLngLat({ lon: longitude, lat: latitude })
		.setHTML(html);
};

const Pin = () => {
	return <div className="h-4 w-4 rounded-full bg-[#516b91]" />;
};
