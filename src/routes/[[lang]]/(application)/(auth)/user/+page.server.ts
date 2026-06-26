import { GET } from '$lib/api/helpers/request';
import type { Subscription } from '$lib/models/subscription';
import { PaymentsInvoices, PaymentsSubscriptions } from '../../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const subscription = GET<{ subscriptions: Subscription[] }>(PaymentsSubscriptions, {
		fetch
	});
	const invoices = GET<{ invoices: unknown[] }>(PaymentsInvoices, { fetch });
	return {
		user: locals.user,
		subscription,
		invoices
	};
};
