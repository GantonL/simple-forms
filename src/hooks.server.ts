import locale from '$lib/hooks/locale';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authHandle } from '$lib/server/auth/handle';
import { BROWSER_SERVICE_HOST } from '$env/static/private';

export const handle = sequence(csrfHandle, locale, authHandle);

// src/hooks.server.js
export async function csrfHandle({ event, resolve }) {
	if (['POST', 'DELETE', 'PUT'].includes(event.request.method)) {
		const origin = event.request.headers.get('origin');
		const allowedOrigins = [`http://${BROWSER_SERVICE_HOST}`];

		if (!allowedOrigins.includes(origin)) {
			return new Response('Forbidden (CSRF)', { status: 403 });
		}
	}
	return resolve(event);
}
