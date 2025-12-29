import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const res = await fetch('http://remote-browser-service.railway.internal:3001/health').catch(
		(e) => {
			console.error(e);
			return;
		}
	);
	console.log(res);
	return json({ healthy: res?.ok });
};
