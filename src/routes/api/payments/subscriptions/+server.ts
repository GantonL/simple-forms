import { getSubscriptions } from '$lib/server/remote/services/payments';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';
export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(300, '/signin');
	}
	const subscriptions = await getSubscriptions(user.email);
	return json({ subscriptions });
};
