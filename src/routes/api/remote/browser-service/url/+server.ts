import { BROWSER_SERVICE_HOST, BROWSER_SERVICE_PORT } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const browserServiceUrl = `http://${BROWSER_SERVICE_HOST}:${BROWSER_SERVICE_PORT}`;
	return json(browserServiceUrl);
};
