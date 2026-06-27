import { getInvoices } from '$lib/server/remote/services/payments';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { Service as UsersEntitlements } from '$lib/server/database/services/users-entitlements';
import { eq } from 'drizzle-orm';
import { userFsEntitlements } from '$lib/server/database/schemas/entitlements';
import { DEFAULT_LIMIT } from '$lib/api/configurations/common';
export const GET: RequestHandler = async ({ locals, url }) => {
	const user = locals.user;
	if (!user) {
		redirect(300, '/signin');
	}
	const entitledUser = await UsersEntitlements.findOne(eq(userFsEntitlements.userId, user.id));
	if (!entitledUser) {
		redirect(300, '/user/plan/upgrade');
	}
	const pagination = {
		count: Number(url.searchParams.get('limit') ?? DEFAULT_LIMIT),
		offset: Number(url.searchParams.get('offset') ?? 0)
	};
	const invoices = await getInvoices(entitledUser?.fsUserId, { pagination });
	return json({ invoices });
};
