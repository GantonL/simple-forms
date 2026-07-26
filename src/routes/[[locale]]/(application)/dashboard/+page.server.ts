import { GET } from '$lib/api/helpers/request';
import { RemoteBrowserServiceLoadStatus, UsersForms } from '../../../api';
import type { PageServerLoad } from './$types';
import { type RemoteBrwoserServiceLoadStatusResponse } from '$lib/types/remote-browser';
import { getFullFormattedDate } from '$lib/utils';

export const load: PageServerLoad = async ({ fetch }) => {
	const remoteBrowserServiceLoadStatus = GET<RemoteBrwoserServiceLoadStatusResponse>(
		RemoteBrowserServiceLoadStatus,
		{ fetch }
	);

	const totalActiveForms = GET(`${UsersForms}?active=true`, { fetch });
	const mostUsedFormsSubmissionsPerDay = Promise.resolve([
		{
			x: getFullFormattedDate(new Date('01/01/1991'), {
				day: 'numeric',
				month: 'short'
			}),
			form1: 4,
			form2: 6,
			form3: 12,
			data: {
				form1: { name: 'טופס 1' },
				form2: { name: 'טופס 2' },
				form3: { name: 'טופס 3' }
			}
		},
		{
			x: getFullFormattedDate(new Date('02/01/1991'), {
				day: 'numeric',
				month: 'short'
			}),
			form1: 1,
			form2: 8,
			form3: 3,
			data: {
				form1: { name: 'טופס 1' },
				form2: { name: 'טופס 2' },
				form3: { name: 'טופס 3' }
			}
		},
		{
			x: getFullFormattedDate(new Date('03/01/1991'), {
				day: 'numeric',
				month: 'short'
			}),
			form1: 5,
			form2: 30,
			form3: 0,
			data: {
				form1: { name: 'טופס 1' },
				form2: { name: 'טופס 2' },
				form3: { name: 'טופס 3' }
			}
		}
	]);
	return {
		remoteBrowserServiceLoadStatus,
		totalActiveForms,
		mostUsedFormsSubmissionsPerDay
	};
};
