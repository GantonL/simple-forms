import { GET } from '$lib/api/helpers/request';
import { RemoteBrowserServiceLoadStatus } from '../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const remoteBrowserServiceLoadStatus = await GET<Record<string, string>>(
		RemoteBrowserServiceLoadStatus,
		{ fetch }
	);
	return { remoteBrowserServiceLoadStatus };
};
