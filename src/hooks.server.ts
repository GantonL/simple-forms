import locale from '$lib/hooks/locale';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authHandle } from '$lib/server/auth/handle';

export const handle = sequence(csrfHandle, locale, authHandle);

export async function csrfHandle({ event, resolve }) {
	const origin = event.request.headers.get('origin');
	console.log('origin made request', origin);
	return resolve(event);
}
