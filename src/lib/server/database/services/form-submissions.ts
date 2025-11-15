import { inArray, type Column } from 'drizzle-orm';
import { FormSubmissionTable, type FormSubmissionInsert } from '../schemas/form';
import type { WhereCondition } from './abstract';
import { provider } from './provider';
import {
	getBodyFiltersUtil,
	getUrlFiltersUtil,
	getUrlOptionsUtil,
	type BodyFiltersUtil
} from './utils';

export const Service = provider.getFactory().getService(FormSubmissionTable);

export const getUrlFilters = (url: URL): WhereCondition<typeof FormSubmissionTable>[] => {
	return getUrlFiltersUtil(url, { searchColumns: [] });
};

type FormSubmissionFilters = BodyFiltersUtil & {
	userFormIds?: string[];
};
const bodyFiltersConfigurations: Record<keyof FormSubmissionFilters, Column> = {
	ids: FormSubmissionTable.id,
	userFormIds: FormSubmissionTable.user_form_id
};
export const getBodyFilters = (
	filters: FormSubmissionFilters
): WhereCondition<typeof FormSubmissionTable>[] => {
	const baseBodyFilters = getBodyFiltersUtil(filters, bodyFiltersConfigurations);
	const serviceFilters = getServiceSpecificBodyFilters(filters, bodyFiltersConfigurations);
	const bodyFilters: WhereCondition<typeof FormSubmissionTable>[] = [
		...baseBodyFilters,
		...serviceFilters
	];
	return bodyFilters;
};

const getServiceSpecificBodyFilters = (
	filters: FormSubmissionFilters,
	configuration: Record<keyof FormSubmissionFilters, Column>
): WhereCondition<typeof FormSubmissionTable>[] => {
	const conditions: WhereCondition<typeof FormSubmissionTable>[] = [];
	for (const key of Object.keys(filters)) {
		const typedKey = key as keyof BodyFiltersUtil;
		const value = filters[typedKey];
		const column = configuration[typedKey];
		if (!column) continue;
		switch (key) {
			case 'userFormIds': {
				conditions.push(inArray(column, value));
			}
		}
	}
	return conditions;
};

export const getUrlOptions = (url: URL) => {
	return getUrlOptionsUtil(url, FormSubmissionTable);
};

type NewFormSubmission = Pick<FormSubmissionInsert, 'user_form_id' | 'storage_url'>;
export const buildCreateCandidates = (candidates: NewFormSubmission[]): NewFormSubmission[] => {
	const newUsers: NewFormSubmission[] = [];
	candidates.forEach((candidate) => {
		newUsers.push({
			user_form_id: candidate.user_form_id,
			storage_url: candidate.storage_url
		});
	});
	return newUsers;
};

type UpdateFormSubmissionData = Pick<FormSubmissionInsert, 'storage_url'>;
export const buildUpdateData = (updateData: UpdateFormSubmissionData): UpdateFormSubmissionData => {
	const validatedUpdate: UpdateFormSubmissionData = {};
	if (updateData?.storage_url) {
		validatedUpdate.storage_url = updateData.storage_url;
	}
	return validatedUpdate;
};
