import { GET, POST } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { FormSettingsSelect, UserForm } from '$lib/server/database/schemas/form';
import { error } from '@sveltejs/kit';
import { UsersForms } from '../../../../../api';
import type { PageServerLoad } from './$types';
import { getDefaultFormSettings } from '$lib/server/database/services/form-settings';

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
	const userId = locals.user.id;
	const userForm = await GET<UserForm>(
		`${UsersForms}/${params.form_id}?${SearchParams.UserId}=${userId}`,
		{
			fetch
		}
	);
	if (!userForm || userForm.user_id !== userId) {
		error(403);
	}
	let settings = await GET<FormSettingsSelect>(`${UsersForms}/${params.form_id}/settings`, {
		fetch
	});

	if (!settings?.id) {
		const defaultSettings = getDefaultFormSettings();
		settings = await POST<Pick<FormSettingsSelect, 'notifications'>, FormSettingsSelect>(
			`${UsersForms}/${params.form_id}/settings`,
			defaultSettings,
			{
				fetch
			}
		);
	}
	return { settings, userForm };
};
