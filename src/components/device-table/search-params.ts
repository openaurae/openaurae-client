import { createSearchParams, useSearchParams } from "react-router-dom";
import z from "zod";

const schema = z.object({
	page: z.coerce.number().optional().default(1),
	size: z.coerce.number().optional().default(10),
	q: z.string().optional().default(""),
	orderBy: z.string().optional().default("last_record"),
	order: z.enum(["ascending", "descending"]).optional().default("descending"),
	types: z.coerce.string().optional().default("all"),
});

export type Params = {
	page: number;
	size: number;
	q: string;
	orderBy: string;
	order: "ascending" | "descending";
	types: string;
};
export type UpdateParams = (prev: Params) => Params;

export function useTableSearchParams(): {
	params: Params;
	getParams: () => Params;
	updateParams: (update: UpdateParams) => void;
} {
	const [searchParams, setSearchParams] = useSearchParams();

	const getParams = () => {
		return schema.parse({
			page: searchParams.get("page") ?? undefined,
			size: searchParams.get("size") ?? undefined,
			q: searchParams.get("q") ?? undefined,
			orderBy: searchParams.get("orderBy") ?? undefined,
			order: searchParams.get("order") ?? undefined,
			types: searchParams.get("types") ?? undefined,
		}) as Params;
	};

	const updateParams = (update: (prev: Params) => Params) => {
		const params = update(getParams());

		setSearchParams(toSearchParams(params));
	};

	return {
		params: getParams(),
		getParams,
		updateParams,
	};
}

function toSearchParams(params: Params): URLSearchParams {
	const pairs: [string, string][] = Object.entries(params)
		.filter(([_, value]) => value)
		.map(([key, value]) => [key, value.toString()]);

	return createSearchParams(pairs);
}
