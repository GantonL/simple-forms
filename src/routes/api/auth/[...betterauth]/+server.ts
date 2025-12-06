import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	return event.locals.authHandler(event.request);
};
export const POST: RequestHandler = async (event) => {
	return event.locals.authHandler(event.request);
};
export const PUT: RequestHandler = async (event) => {
	return event.locals.authHandler(event.request);
};
export const DELETE: RequestHandler = async (event) => {
	return event.locals.authHandler(event.request);
};
