import { getPlanNameById } from "$lib/server/remote/services/payments";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	return {
		plan: getPlanNameById(locals.user?.plan_id ?? '')
	};
};
