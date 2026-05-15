import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from './config';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { isRouteRequiresAuthentication } from '$lib/utils';

export async function handle({ event, resolve }): Promise<Response> {
	if (event.url.pathname.startsWith('/api/webhooks')) {
		return resolve(event);
	}
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	const requestedPath = event.url.pathname;
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	} else if (isRouteRequiresAuthentication(requestedPath)) {
		redirect(302, `/signin?ref=${requestedPath}`);
	}
	event.locals.authHandler = auth.handler;
	return svelteKitHandler({ event, resolve, auth, building });
}
