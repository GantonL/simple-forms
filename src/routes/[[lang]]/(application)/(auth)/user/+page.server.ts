import { GET } from '$lib/api/helpers/request';
import { getPlanNameById } from '$lib/server/remote/services/payments';
import { PaymentsSubscriptions } from '../../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const subscriptionRes = await GET<{ subscriptions: unknown[] }>(PaymentsSubscriptions, { fetch });
	const subscription =
		subscriptionRes?.subscriptions.find(
			(sub) => sub?.license_id === locals.user.license_id && sub?.status !== 'cancelled'
		) ?? subscriptionRes?.subscriptions?.[0];
	return {
		user: locals.user,
		plan: getPlanNameById(locals.user.plan_id),
		subscription
	};
};
