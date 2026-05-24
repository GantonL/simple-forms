import { getInvoices } from '$lib/server/remote/services/payments';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { Service as UsersEntitlements } from '$lib/server/database/services/users-entitlements';
import { eq } from 'drizzle-orm';
import { userFsEntitlements } from '$lib/server/database/schemas/entitlements';
export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(300, '/signin');
	}
	const entitledUser = await UsersEntitlements.findOne(eq(userFsEntitlements.userId, user.id));
	if (!entitledUser) {
		redirect(300, '/user/plan/upgrade');
	}
	const invoices = await getInvoices(entitledUser?.fsUserId);
	return json({ invoices });
};
