import type { Column } from 'drizzle-orm';
import { FormTemplateTable, type FormTemplateTableInsert } from '../schemas/form';
import type { WhereCondition } from './abstract';
import { provider } from './provider';
import {
	getBodyFiltersUtil,
	getUrlFiltersUtil,
	getUrlOptionsUtil,
	type BodyFiltersUtil
} from './utils';

export const Service = provider.getFactory().getService(FormTemplateTable);

export const getUrlFilters = (url: URL): WhereCondition<typeof FormTemplateTable>[] => {
	return getUrlFiltersUtil(url, {
		searchColumns: [FormTemplateTable.key]
	});
};

type FormTemplateFilters = BodyFiltersUtil;
const bodyFiltersConfigurations: Record<keyof FormTemplateFilters, Column> = {
	ids: FormTemplateTable.id
};
export const getBodyFilters = (
	filters: FormTemplateFilters
): WhereCondition<typeof FormTemplateTable>[] => {
	return getBodyFiltersUtil(filters, bodyFiltersConfigurations);
};

export const getUrlOptions = (url: URL) => {
	return getUrlOptionsUtil(url, FormTemplateTable);
};

type NewFormTemplate = Pick<FormTemplateTableInsert, 'key' | 'schema'>;
export const buildCreateCandidates = (candidates: NewFormTemplate[]): NewFormTemplate[] => {
	const newUsers: NewFormTemplate[] = [];
	candidates.forEach((candidate) => {
		newUsers.push({
			key: candidate.key,
			schema: candidate.schema
		});
	});
	return newUsers;
};

type UpdateFormTemplateData = Partial<NewFormTemplate>;
export const buildUpdateData = (updateData: UpdateFormTemplateData): UpdateFormTemplateData => {
	const validatedUpdate: UpdateFormTemplateData = {};
	if (updateData?.schema) {
		validatedUpdate.schema = updateData.schema;
	}
	return validatedUpdate;
};
