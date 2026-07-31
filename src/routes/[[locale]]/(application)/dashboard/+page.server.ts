import { GET } from '$lib/api/helpers/request';
import { RemoteBrowserServiceLoadStatus, UsersForms } from '../../../api';
import type { PageServerLoad } from './$types';
import { type RemoteBrwoserServiceLoadStatusResponse } from '$lib/types/remote-browser';

export const load: PageServerLoad = async ({ fetch }) => {
	const remoteBrowserServiceLoadStatus = GET<RemoteBrwoserServiceLoadStatusResponse>(
		RemoteBrowserServiceLoadStatus,
		{ fetch }
	);

	const totalActiveForms = GET(`${UsersForms}?active=true`, { fetch });
	const mostUsedFormsSubmissionsPerDay = GET(
		`${UsersForms}/submissions-history?active=true&limit=3`,
		{ fetch, orderBy: '-submissions' }
	);
	return {
		remoteBrowserServiceLoadStatus,
		totalActiveForms,
		mostUsedFormsSubmissionsPerDay
	};
};
