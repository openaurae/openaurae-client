export interface TableColumn {
	key: string;
	label: string;
	allowsSorting: boolean;
}

export const columns: TableColumn[] = [
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
		key: "room",
		label: "ROOM",
		allowsSorting: false,
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
