import { eq, or, isNull, type Column } from 'drizzle-orm';
import { FormTemplateTable, type FormTemplateTableInsert } from '../schemas/form';
import type { WhereCondition } from './abstract';
import { provider } from './provider';
import {
	getBodyFiltersUtil,
	getUrlFiltersUtil,
	getUrlOptionsUtil,
	type BodyFiltersUtil
} from './utils';
import { SearchParams } from '$lib/enums/search-params';

export const Service = provider.getFactory().getService(FormTemplateTable);

export const getUrlFilters = (url: URL): WhereCondition<typeof FormTemplateTable>[] => {
	const baseUrlFilters = getUrlFiltersUtil(url, {
		searchColumns: [FormTemplateTable.key]
	});
	const serviceUrlFilters = getServiceUrlFilters(url);
	return [...baseUrlFilters, ...serviceUrlFilters];
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

type NewFormTemplate = Pick<FormTemplateTableInsert, 'key' | 'schema' | 'user_id' | 'is_community'>;
export const buildCreateCandidates = (candidates: NewFormTemplate[]): NewFormTemplate[] => {
	const newTemplates: NewFormTemplate[] = [];
	candidates.forEach((candidate) => {
		newTemplates.push({
			key: candidate.key,
			schema: candidate.schema,
			user_id: candidate.user_id,
			is_community: candidate.is_community ?? false
		});
	});
	return newTemplates;
};

type UpdateFormTemplateData = Partial<NewFormTemplate>;
export const buildUpdateData = (updateData: UpdateFormTemplateData): UpdateFormTemplateData => {
	const validatedUpdate: UpdateFormTemplateData = {};
	if (updateData?.schema) {
		validatedUpdate.schema = updateData.schema;
	}
	if (updateData?.is_community !== undefined) {
		validatedUpdate.is_community = updateData.is_community;
	}
	return validatedUpdate;
};

const getServiceUrlFilters = (url: URL): WhereCondition<typeof FormTemplateTable>[] => {
	const searchParams = url.searchParams;
	const tid = searchParams.get(SearchParams.TemplateId);
	const conditions: WhereCondition<typeof FormTemplateTable>[] = [];
	if (tid) {
		conditions.push(eq(FormTemplateTable.id, Number(tid)));
	}
	
	const visibleForUserId = searchParams.get('visible_for_user_id');
	if (visibleForUserId) {
		const visibilityOr = or(
			isNull(FormTemplateTable.user_id),
			eq(FormTemplateTable.is_community, true),
			eq(FormTemplateTable.user_id, visibleForUserId)
		);
		if (visibilityOr) {
			conditions.push(visibilityOr);
		}
	}
	
	const isCommunity = searchParams.get('is_community');
	if (isCommunity !== null) {
		conditions.push(eq(FormTemplateTable.is_community, isCommunity === 'true'));
	}

	return conditions;
};
