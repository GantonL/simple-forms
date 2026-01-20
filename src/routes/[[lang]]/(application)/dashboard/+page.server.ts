import { GET } from '$lib/api/helpers/request';
import { RemoteBrowserServiceLoadStatus } from '../../../api';
import type { PageServerLoad } from './$types';
import { type RemoteBrwoserServiceLoadStatusResponse } from '$lib/types/remote-browser';

export const load: PageServerLoad = async ({ fetch }) => {
	const remoteBrowserServiceLoadStatus = await GET<RemoteBrwoserServiceLoadStatusResponse>(
		RemoteBrowserServiceLoadStatus,
		{ fetch }
	);

	return { remoteBrowserServiceLoadStatus };
};
