import { PAYMENTS_SERVICE_PORT, PAYMENTS_SERVICE_HOST } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

const baseUrl = `http://${PAYMENTS_SERVICE_HOST}:${PAYMENTS_SERVICE_PORT}`;

async function validateLicense(licenseId: string) {
	const res = await fetch(`${baseUrl}/licenses/validate?license_id=${licenseId}`);
	return res.json() as Promise<{ valid: boolean; plan?: string; message: string }>;
}

export async function handle({ event, resolve }): Promise<Response> {
	if (event.url.pathname.startsWith('/api/webhooks')) {
		return resolve(event);
	}
	const licenseId = event.locals?.user?.license_id;
	const result = licenseId ? await validateLicense(licenseId) : { valid: false };
	if (!result?.valid) {
		return redirect(302, '/pricing');
	}
	return resolve(event);
}
