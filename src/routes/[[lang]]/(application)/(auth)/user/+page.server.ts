import { GET } from '$lib/api/helpers/request';
import type { Subscription } from '$lib/models/subscription';
import { PaymentsInvoices, PaymentsSubscriptions } from '../../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const subscriptionRes = await GET<{ subscriptions: Subscription[] }>(PaymentsSubscriptions, {
		fetch
	});
	const subscription =
		subscriptionRes?.subscriptions.find(
			(sub) => sub?.license_id === locals.user.license_id && sub?.status !== 'cancelled'
		) ?? subscriptionRes?.subscriptions?.[0];
	const invoicesRes = await GET<{ invoices: unknown[] }>(PaymentsInvoices, { fetch });
	const invoices = invoicesRes?.invoices;
	return {
		user: locals.user,
		subscription,
		invoices
	};
};
