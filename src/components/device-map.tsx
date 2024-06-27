import { Device } from "@/types";
import { formatDateTime } from "@/utils/datetime";
import mapboxgl, { Popup } from "mapbox-gl";
import { useState } from "react";
import Map, { Marker, ViewState } from "react-map-gl";

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
    <Map
      {...viewState}
      mapboxAccessToken="pk.eyJ1IjoibW9uYXNoYXVyYWUiLCJhIjoiY2pyMGJqbzV2MDk3dTQ0bndqaHA4d3hzeSJ9.TDvqYvsmY1DHhE8N8_UbFg"
      style={{ width: "100%", height: "100.5%" }}
      mapStyle={mapStyle}
      onMove={(e) => setViewState(e.viewState)}
      onZoom={(e) => setViewState(e.viewState)}
    >
      {devices.map((device) => (
        <Marker
          key={device.id}
          longitude={device.longitude!}
          latitude={device.latitude!}
          color="red"
          popup={buildPopup(device)}
          onClick={() => onDeviceSelected(device)}
        >
          <Pin />
        </Marker>
      ))}
    </Map>
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

  return new mapboxgl.Popup({
    className: "text-default",
  })
    .setLngLat({ lon: longitude!, lat: latitude! })
    .setHTML(html);
};

const Pin = () => {
  return (
    <div
      aria-description="a dot marking a device on the map"
      className="h-4 w-4 rounded-full bg-[#516b91]"
    ></div>
  );
};
