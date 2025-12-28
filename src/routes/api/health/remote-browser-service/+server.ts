import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch }) => {
	const remoteBrowserService = await fetch('remote-browser-service.railway.internal/health');
	return json({ healthy: !!remoteBrowserService?.ok });
};
