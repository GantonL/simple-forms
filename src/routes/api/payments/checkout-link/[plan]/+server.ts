import type { AvailableLocals } from '$lib/enums/available-locales';
import type { Plans } from '$lib/enums/plans';
import { getCheckoutLink } from '$lib/server/remote/services/payments';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';
export const GET: RequestHandler = async ({ params, locals, url }) => {
	const user = locals.user;
	if (!user) {
		redirect(300, '/signin');
	}
	const language = url.searchParams.get('language') as AvailableLocals;
	const checkoutLink = await getCheckoutLink(user, params.plan as Plans, { language });
	return json({ checkoutLink });
};
