import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';
import { Service as UsersEntitlements } from '$lib/server/database/services/users-entitlements';
import { eq } from 'drizzle-orm';
import { userFsEntitlements } from '$lib/server/database/schemas/entitlements';
import { getInvoicePdf } from '$lib/server/remote/services/payments';
export const GET: RequestHandler = async ({ locals, params }) => {
	const invoiceId = params.invoice_id;
	if (!invoiceId) error(400);
	const user = locals.user;
	if (!user) {
		redirect(300, '/signin');
	}
	const entitledUser = await UsersEntitlements.findOne(eq(userFsEntitlements.userId, user.id));
	if (!entitledUser) {
		redirect(300, '/user/plan/upgrade');
	}
	const pdf = await getInvoicePdf(invoiceId);
	return json({ pdf });
};
