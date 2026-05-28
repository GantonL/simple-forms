import { getPlanNameById } from '$lib/server/remote/services/payments';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const activePlan = getPlanNameById(locals.user?.plan_id ?? '');
	return {
		activePlan
	};
};
