import {
	PAYMENTS_SERVICE_PORT,
	PAYMENTS_SERVICE_HOST,
	PRODUCT_ID,
	BASIC_PLAN_ID,
	ENV
} from '$env/static/private';
import { Plans } from '$lib/enums/plans';
import { getRouteRequiresPlan } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { User } from 'better-auth';

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
	if (!planId) {
		return redirect(302, '/pricing');
	}
	const planName = getPlanNameById(planId);
	if (!planName) {
		return error(500, 'Unknown user plan id');
	}
	if (!requiredPlan.includes(planName)) {
		return redirect(302, '/user/plan/upgrade');
	}
	const licenseId = event.locals?.user?.license_id;
	const result = licenseId ? await validateLicense(licenseId) : { valid: false };
	if (!result?.valid) {
		return redirect(302, '/user/plan/renew');
	}
	return resolve(event);
}

export async function getSubscriptions(userEmail: string) {
	try {
		const res = await fetch(`${baseUrl}/subscriptions?user_email=${userEmail}`);
		const subscriptionsJsonResult = await res.json();
		return subscriptionsJsonResult?.subscriptions ?? [];
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function cancelSubscription(id: string) {
	try {
		const res = await fetch(`${baseUrl}/subscriptions/${id}`, { method: 'DELETE' });
		return res.json();
	} catch (error) {
		console.log(error);
		return;
	}
}

export function getProductId() {
	return PRODUCT_ID;
}

export function getPlanId(plan: Plans) {
	switch (plan) {
		case Plans.Basic: {
			return BASIC_PLAN_ID;
		}
	}
}

export function getPlanNameById(id: string) {
	switch (id) {
		case BASIC_PLAN_ID: {
			return Plans.Basic;
		}
	}
}

export function getCheckoutLink(user: User, plan: Plans) {
	const baseCheckoutUrl = `https://checkout.freemius.com/product/${getProductId()}/plan/${getPlanId(plan)}`;
	const queryParams = new URLSearchParams({
		user_email: user.email,
		readonly_user: 'true'
	});
	if (ENV === 'local') {
		queryParams.append('sandbox', 'true');
	}
	return `${baseCheckoutUrl}?${queryParams.toString()}`;
}

export async function validateCheckoutCompletionResponse(url: string) {
	try {
		const body = JSON.stringify({ url });
		const res = await fetch(`${baseUrl}/checkout/validate`, { method: 'POST', body });
		return !!res?.ok;
	} catch {
		return { valid: false };
	}
}

export async function getInvoices(user_id: string) {
	try {
		const res = await fetch(`${baseUrl}/invoices?user_id=${user_id}`);
		const invoicesJsonResult = await res.json();
		return invoicesJsonResult?.payments ?? [];
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function getInvoicePdf(id: string) {
	try {
		const headers = new Headers();
		headers.append('Content-Type', 'application/pdf');
		const res = await fetch(`${baseUrl}/invoices/${id}/pdf`, { headers });
		const arrayBuffer = await res.arrayBuffer();
		const base64String = Buffer.from(arrayBuffer).toString('base64');
		return base64String;
	} catch (error) {
		console.log(error);
		return;
	}
}
