import { eq, type Column } from 'drizzle-orm';
import {
	FormSettingsTable,
	type FormSettingsInsert,
	type FormSettingsSelect
} from '../schemas/form';
import type { WhereCondition } from './abstract';
import { provider } from './provider';
import {
	getBodyFiltersUtil,
	getUrlFiltersUtil,
	getUrlOptionsUtil,
	type BodyFiltersUtil
} from './utils';
import { SearchParams } from '$lib/enums/search-params';
import { NOTIFICATIONS } from '$lib/models/workflows';

export const Service = provider.getFactory().getService(FormSettingsTable);

export const getUrlFilters = (url: URL): WhereCondition<typeof FormSettingsTable>[] => {
	const baseUrlFilters = getUrlFiltersUtil(url, {
		searchColumns: []
	});
	const serviceUrlFilters = getServiceUrlFilters(url);
	return [...baseUrlFilters, ...serviceUrlFilters];
};

type FormSettingsFilters = BodyFiltersUtil;
const bodyFiltersConfigurations: Record<keyof FormSettingsFilters, Column> = {
	ids: FormSettingsTable.id
};
export const getBodyFilters = (
	filters: FormSettingsFilters
): WhereCondition<typeof FormSettingsTable>[] => {
	return getBodyFiltersUtil(filters, bodyFiltersConfigurations);
};

export const getUrlOptions = (url: URL) => {
	return getUrlOptionsUtil(url, FormSettingsTable);
};

type NewFormSettings = Pick<FormSettingsInsert, 'notifications' | 'user_form_id'>;
export const buildCreateCandidates = (candidates: NewFormSettings[]): NewFormSettings[] => {
	const newFormSettings: NewFormSettings[] = [];
	candidates.forEach((candidate) => {
		newFormSettings.push({
			user_form_id: candidate.user_form_id,
			notifications: candidate.notifications
		});
	});
	return newFormSettings;
};

type UpdateFormSettingsData = Pick<FormSettingsInsert, 'notifications'>;
export const buildUpdateData = (updateData: UpdateFormSettingsData): UpdateFormSettingsData => {
	const validatedUpdate: UpdateFormSettingsData = {};
	if (updateData?.notifications) {
		validatedUpdate.notifications = updateData.notifications;
	}
	return validatedUpdate;
};

const getServiceUrlFilters = (url: URL): WhereCondition<typeof FormSettingsTable>[] => {
	const searchParams = url.searchParams;
	const fid = searchParams.get(SearchParams.FormId);
	const conditions: WhereCondition<typeof FormSettingsTable>[] = [];
	if (fid) {
		conditions.push(eq(FormSettingsTable.id, Number(fid)));
	}
	return conditions;
};

export const getDefaultFormSettings = (): Pick<FormSettingsSelect, 'notifications'> => {
	return {
		notifications: {
			[NOTIFICATIONS.FORM_SIGNED]: {
				enabled: false
			}
		}
	};
};
