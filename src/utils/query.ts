import axios, { type AxiosInstance } from "axios";

const _axios: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || window.location.origin,
});

export type QueryParams = {
	[key: string]: unknown;
	url: string;
	accessToken?: string;
};

export const get = async <T>({
	url,
	accessToken,
	...params
}: QueryParams): Promise<T> => {
	const resp = await _axios.get<T>(url, {
		headers: {
			Authorization: accessToken && `Bearer ${accessToken}`,
		},
		params: params,
	});

	return resp.data;
};

export const postJson = async <T>({
	url,
	accessToken,
	...body
}: QueryParams): Promise<T> => {
	const resp = await _axios.post<T>(url, body, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return resp.data;
};

export const putJson = async <T>({
	url,
	accessToken,
	...body
}: QueryParams): Promise<T> => {
	const resp = await _axios.put<T>(url, body, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return resp.data;
};

export const remove = async <T>({
	url,
	accessToken,
}: QueryParams): Promise<T> => {
	const resp = await _axios.delete<T>(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return resp.data;
};
