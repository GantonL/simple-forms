import { PAYMENTS_SERVICE_PORT, PAYMENTS_SERVICE_HOST } from '$env/static/private';
import { getRouteRequiresPlan } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

const baseUrl = `http://${PAYMENTS_SERVICE_HOST}:${PAYMENTS_SERVICE_PORT}`;

async function validateLicense(licenseId: string) {
	try {
		const res = await fetch(`${baseUrl}/licenses/validate?license_id=${licenseId}`);
		return res.json() as Promise<{ valid: boolean; plan?: string; message: string }>;
	} catch (error) {
		console.log(error);
		return { valid: false };
	}
}

export async function handle({ event, resolve }): Promise<Response> {
	const pathName = event.url.pathname;
	const planId = event.locals?.user?.plan_id;
	const requiredPlan = getRouteRequiresPlan(pathName);
	if (!requiredPlan || requiredPlan?.length === 0) {
		return resolve(event);
	}
	if (!requiredPlan.includes(planId)) {
		return redirect(302, '/user/plan/upgrade');
	}
	const licenseId = event.locals?.user?.license_id;
	const result = licenseId ? await validateLicense(licenseId) : { valid: false };
	if (!result?.valid) {
		return redirect(302, '/user/plan/renew');
	}
	return resolve(event);
}
