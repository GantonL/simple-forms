import { eq, inArray, type Column } from 'drizzle-orm';
import {
	FormSubmissionCandidateDataTable,
	type FormSubmissionCandidateDataInsert
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

export const Service = provider.getFactory().getService(FormSubmissionCandidateDataTable);

export const getUrlFilters = (
	url: URL
): WhereCondition<typeof FormSubmissionCandidateDataTable>[] => {
	const baseUrlFilters = getUrlFiltersUtil(url, { searchColumns: [] });
	const serviceUrlFilters = getServiceUrlFilters(url);
	return [...baseUrlFilters, ...serviceUrlFilters];
};

type FormSubmissionFilters = BodyFiltersUtil & {
	userFormIds?: string[];
};
const bodyFiltersConfigurations: Record<keyof FormSubmissionFilters, Column> = {
	ids: FormSubmissionCandidateDataTable.id,
	userFormIds: FormSubmissionCandidateDataTable.user_form_id
};
export const getBodyFilters = (
	filters: FormSubmissionFilters
): WhereCondition<typeof FormSubmissionCandidateDataTable>[] => {
	const baseBodyFilters = getBodyFiltersUtil(filters, bodyFiltersConfigurations);
	const serviceFilters = getServiceSpecificBodyFilters(filters, bodyFiltersConfigurations);
	const bodyFilters: WhereCondition<typeof FormSubmissionCandidateDataTable>[] = [
		...baseBodyFilters,
		...serviceFilters
	];
	return bodyFilters;
};

const getServiceSpecificBodyFilters = (
	filters: FormSubmissionFilters,
	configuration: Record<keyof FormSubmissionFilters, Column>
): WhereCondition<typeof FormSubmissionCandidateDataTable>[] => {
	const conditions: WhereCondition<typeof FormSubmissionCandidateDataTable>[] = [];
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
	return getUrlOptionsUtil(url, FormSubmissionCandidateDataTable);
};

type NewFormSubmissionCandidateData = Pick<
	FormSubmissionCandidateDataInsert,
	'user_form_id' | 'data' | 'options'
>;
export const buildCreateCandidates = (
	candidates: NewFormSubmissionCandidateData[]
): NewFormSubmissionCandidateData[] => {
	const newCandidates: NewFormSubmissionCandidateData[] = [];
	candidates.forEach((candidate) => {
		newCandidates.push({
			user_form_id: candidate.user_form_id,
			data: candidate.data,
			options: candidate.options
		});
	});
	return newCandidates;
};

type FormSubmissionCandidateData = Pick<FormSubmissionCandidateDataInsert, 'data'>;
export const buildUpdateData = (
	updateData: FormSubmissionCandidateData
): FormSubmissionCandidateData => {
	const validatedUpdate: FormSubmissionCandidateData = {};
	if (updateData?.data) {
		validatedUpdate.data = updateData.data;
	}
	return validatedUpdate;
};

const getServiceUrlFilters = (
	url: URL
): WhereCondition<typeof FormSubmissionCandidateDataTable>[] => {
	const searchParams = url.searchParams;
	const fid = searchParams.get(SearchParams.FormId);
	const conditions: WhereCondition<typeof FormSubmissionCandidateDataTable>[] = [];
	if (fid) {
		conditions.push(eq(FormSubmissionCandidateDataTable.user_form_id, Number(fid)));
	}
	return conditions;
};
