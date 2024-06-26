import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Tooltip } from "@nextui-org/tooltip";
import clsx from "clsx";
import { Download, Eye, Pencil, Search, Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

import { useDevices } from "@/hooks/use-devices";
import { Device } from "@/types";
import { formatDateTime, timestamp } from "@/utils/datetime";
import { sortByNumericField, sortByStringField } from "@/utils/sort";

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
        <div className="flex">
          <Input
            isClearable
            className="w-full sm:max-w-sm"
            placeholder="Search by id..."
            startContent={<Search size={20} />}
            value={searchValue}
            onClear={() => setSearchValue("")}
            onValueChange={onSearchChange}
          />
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
  }, [sortedDevices.length, onRowsPerPageChange, searchValue]);

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
  }, [sortedDevices.length, page, pages]);

  const renderCell = useCallback((device: Device, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{device.id}</span>;
      case "name":
        return <span>{device.name}</span>;
      case "longitude":
        return <span>{device.longitude?.toFixed(6)}</span>;
      case "latitude":
        return <span>{device.latitude?.toFixed(6)}</span>;
      case "last_record":
        return <span>{formatDateTime(device.last_record)}</span>;
      case "actions":
        return <Actions className="px-6" deviceId={device.id} />;
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

const Actions = ({
  deviceId,
  className,
}: React.ComponentProps<"div"> & { deviceId: string }) => {
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center gap-4 py-1",
        className,
      )}
    >
      <Tooltip content="View Details">
        <Link href={`/devices/${deviceId}`}>
          <Eye className="text-lg text-default-400" size={20} />
        </Link>
      </Tooltip>
      <Tooltip content="Edit Device">
        <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
          <Pencil size={20} />
        </span>
      </Tooltip>
      <Tooltip content="Export Sensor Records">
        <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
          <Download size={20} />
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete Device">
        <span className="cursor-pointer text-lg text-danger active:opacity-50">
          <Trash2 size={20} />
        </span>
      </Tooltip>
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
