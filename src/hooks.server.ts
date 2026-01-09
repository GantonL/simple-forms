import locale from '$lib/hooks/locale';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authHandle } from '$lib/server/auth/handle';
import { BASE_APP_URL, BROWSER_SERVICE_HOST, BROWSER_SERVICE_PORT } from '$env/static/private';

export const handle = sequence(csrfHandle, locale, authHandle);

export async function csrfHandle({ event, resolve }) {
	if (['POST', 'DELETE', 'PUT', 'PATCH'].includes(event.request.method)) {
		const origin = event.request.headers.get('origin');
		console.log('Request from origin', origin);
		const allowedOrigins = [
			`http://${BROWSER_SERVICE_HOST}:${BROWSER_SERVICE_PORT}`,
			BASE_APP_URL,
			'http://localhost:5173'
		];

		if (!allowedOrigins.includes(origin)) {
			return new Response('Forbidden (CSRF)', { status: 403 });
		}
	}
	return resolve(event);
}
