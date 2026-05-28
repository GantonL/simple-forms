import { getUserCookiesPreferences } from '$lib/manage-cookies/manager';
import { getPlanNameById } from '$lib/server/remote/services/payments';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	const showManageCookiesPreferences = event.cookies.get('show-manage-cookies-banner');
	const cookieBannerOpen =
		showManageCookiesPreferences === 'true' || showManageCookiesPreferences === undefined;
	const activePlan = getPlanNameById(event.locals.user?.plan_id ?? '');
	return {
		cookieBannerOpen,
		cookiePreferences: getUserCookiesPreferences(event),
		activePlan
	};
};
