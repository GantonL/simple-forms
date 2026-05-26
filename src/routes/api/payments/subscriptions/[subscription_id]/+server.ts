import { cancelSubscription, getSubscriptions } from '$lib/server/remote/services/payments';
import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(300, '/signin');
	}
	const userSubscriptions = await getSubscriptions(user.email);
	const subscription = userSubscriptions.find(
		(sub: { id: string }) => sub.id === params.subscription_id
	);
	if (!subscription) {
		error(404, 'Subscription not found');
	}
	const cancelled = await cancelSubscription(subscription.id);
	return json({ cancelled });
};
