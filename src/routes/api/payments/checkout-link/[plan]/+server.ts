import type { Plans } from '$lib/enums/plans';
import { getCheckoutLink } from '$lib/server/remote/services/payments';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';
export const GET: RequestHandler = async ({ params, locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(300, '/signin');
	}
	const checkoutLink = getCheckoutLink(user, params.plan as Plans);
	return json({ checkoutLink });
};
