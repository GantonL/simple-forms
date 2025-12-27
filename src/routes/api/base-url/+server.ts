import { BASE_APP_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const link = BASE_APP_URL;
	return json(link);
};
