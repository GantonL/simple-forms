import { requestLoadStatus } from '$lib/server/remote/services/remote-browser';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const loadStatus = await requestLoadStatus();
	return json(loadStatus);
};
