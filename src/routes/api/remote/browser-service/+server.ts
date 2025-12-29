import { BROWSER_SERVICE_HOST, BROWSER_SERVICE_PORT } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	console.log('getting brwoser service health status');
	const browserServiceUrl = `http://${BROWSER_SERVICE_HOST}:${BROWSER_SERVICE_PORT}`;
	console.log('browser service url', browserServiceUrl);
	const res = await fetch(`${browserServiceUrl}/health`).catch((e) => {
		console.error(e);
		return;
	});
	console.log('response', res);
	return json({ healthy: res?.ok });
};
