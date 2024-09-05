import { useTableSearchParams } from "@/components/device-table/search-params.ts";
import { Pagination, type PaginationProps } from "@nextui-org/pagination";

export function TablePagination(props: PaginationProps) {
	return (
		<div className="flex items-center justify-center">
			<Pagination
				isCompact
				showControls
				showShadow
				color="primary"
				{...props}
			/>
		</div>
	);
}

export function PageSizeSelector({
	updatePageSize,
}: { updatePageSize: (newSize: number) => void }) {
	const { params } = useTableSearchParams();
	return (
		<label className="flex items-center text-small text-default-400">
			Rows per page:
			<select
				className="bg-transparent text-small text-default-400 outline-none"
				onChange={(e) => {
					const pageCount = Number(e.target.value);
					updatePageSize(pageCount);
				}}
				defaultValue={params.size}
			>
				<option value="10">10</option>
				<option value="20">20</option>
				<option value="50">50</option>
			</select>
		</label>
	);
}
