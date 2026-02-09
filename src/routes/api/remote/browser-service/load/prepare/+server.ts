import { requestToPrepare } from '$lib/server/remote/services/remote-browser';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
	const prepareRes = await requestToPrepare();
	return json(prepareRes);
};
